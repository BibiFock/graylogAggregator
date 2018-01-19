import Debug from 'debug';
import http from 'http';

import config from '../../config/app';

var debug = Debug('worker-GrayLog');

class Graylog {
    constructor () {
        this._events = {
            'downloadComplete': [],
            'downloadProgress': [],
            'downloadFailed': [],
        };
        this.reset();
    }

    downloadFinish() {
        var range = this._params.range;
        this.reset();
        this._params.range = range;
    }

    reset () {
        this._nbMsg = 0;
        this._stats = [];
        this._total = 0;
        this._lastIds = [];
        this._state = 0;

        this._params = {
            query: config.graylog.query.query,
            limit: config.graylog.query.limit,
            range: 5*60,
            //fields: 'app,message,url',
        };
    }

    stop(callback) {
        if ( this._state == 0 ) {
            if (callback) {
                callback();
            }
            return false;
        }

        this._state = -1;

        setTimeout( () => {
            this.stop(callback);
        }, 1000);
    }

    start () {
        if (this._state > 0) {
            return false;
        }

        this._state = 1;
        this.getStats();
        return true;
    }

    //////////////////////
    // url part
    //////////////////////
    setParams (params) {
        for (var i in this._params) {
            if (params[i]) {
                this._params[i] = params[i];
            }
        }
    }

    getParams () {
        var params = [];
        for (var name in this._params) {
            params.push(name + '=' + encodeURIComponent( this._params[name] ));
        }

        return params.join('&');
    }

    getUrl () {
        return '/search/universal/' +
            ( this._nbMsg > 0 ? 'absolute' : 'relative') + '?';
    }

    getStats() {
        var options = {
            host: config.graylog.url,
            port: config.graylog.port.api,
            method: 'GET',
            path: this.getUrl() + this.getParams(),
            auth: config.graylog.auth,
            headers: { 'Accept': 'application/json' }
        };
        debug('getStats', options, config.graylog.columns.message);

       var request = http.request(options,  (response) => {
            var body = '';
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                body += chunk;
            });

            response.on('end', () => {
                if (response.statusCode == 200) {
                    this.parse(body);
                    return true;
                }
                let json = JSON.parse(body);
                this._emit('downloadFailed',{
                    success: false,
                    message: 'Url download Failed: ' + response.statusCode,
                    details: json.message
                });
                this.finishDownload();
            });
        }).end();
    }

    parse (body) {
        var data = JSON.parse( body );
        var nbMsg = 0;
        var columns = config.graylog.columns.message;
        var ids = [];

        var lastTimestamp = data.messages[data.messages.length-1].message.timestamp;
        for (var i = 0; i < data.messages.length; i++) {
            var msg = data.messages[i].message;
            if (this._lastIds.indexOf(msg._id) > -1) {
                continue;
            }
            var index = data.messages[i].index;
            if (msg.app == undefined) {
                msg.app = 'unknown';
            }
            var key = columns.map( (col) => {
                return msg[col.name];
            }).join('-');
            if (this._stats[key] == undefined) {
                this._stats[key] = {
                    total:0,
                    percent:0,
                    messages:[]
                };
                columns.forEach( (col) => {
                    this._stats[key][col.name] = msg[col.name];
                });
            }
            if (this._stats[key].messages.length < 10) {
                msg.link = 'http://' + config.graylog.url + ':' + config.graylog.port.web +
                    '/messages/' + index + '/' + msg._id;
                this._stats[key].messages.push( msg );
            }
            this._stats[key].total++;
            nbMsg++;
            ids.push(msg._id);
        }
        this._lastIds = ids;

        if ( !this.isEndOfDownload( nbMsg, data.total_results) ) {
            this._params.from = data.from;
            this._params.to = lastTimestamp;
            this.getStats();

            return;
        }

        this.finishDownload();
    }

    finishDownload () {
        var groupedStats = []
        for (var index in this._stats) {
            this._stats[index].percent = this._stats[index].total / this.nbMsg * 100;
            groupedStats.push( this._stats[index] );
        }

        groupedStats.sort((a, b) => {
            return b.total - a.total;
        });

        this._emit('downloadComplete', {
            stats: groupedStats,
            nbMsg: this._nbMsg,
            total: this._total
        });
    }

    isEndOfDownload (nbMsg, total) {
        this._nbMsg += nbMsg;
        if (this._total == 0) {
            this._total = total;
        }

        this._emit('downloadProgress', {
            nbMsg: this._nbMsg, total: this._total
        });

        return (this._state < 0 || this._nbMsg == this._total);
    }

    //event
    on (event, callback) {
        if ( this._events[event] ) {
            this._events[event].push( callback );
        }


        return this;
    }

    _emit ( event, args ) {
        if (/^(downloadFailed|downloadComplete)$/.test(event)) {
            this.downloadFinish();
        }
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i]( args );
        };
    }

}

module.exports = Graylog;
