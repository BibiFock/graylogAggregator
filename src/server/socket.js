import Debug from 'debug';
import cron from 'cron';

import Graylog from './graylog';
import config from '../../config/app';

var debug = Debug('worker-Socket');

module.exports = (socket) => {
    socket.on('disconnect', () => {
        gl.stop();
        debug( 'client is leavinnnng');
    });

    //first launch
    debug('define graylog object');

    var gl = new Graylog();
    gl.on('downloadProgress', (stats) => {
        debug(' %d\%',  stats.nbMsg / stats.total * 100);
        socket.emit('stats:download:progress', stats);
    }).on('downloadComplete', (stats) => {
        debug('download complete: %d messages',  stats.total);
        socket.emit('stats:download:content', stats);
    }).on('downloadFailed', (message) => {
        debug('downloadFailed ', message);
        socket.emit('stats:download:error', message);
    });

    var job = new cron.CronJob({
        cronTime: config.refreshDelay,
        onTick: () => {
            socket.emit('stats:download:need', null);
        },
        runOnInit: false,
        start:true
    });

    socket.on('client:request:new', (params) => {
        gl.stop ( () => {
            debug('launch another download with this ', params);
            gl.reset();
            gl.setParams(params);
            gl.start();
        });
    });

};
