import React from 'react/addons';
import http from 'http';
import Debug from 'debug';
import io from 'socket.io-client';

import GraylogMsg from './graylog/msg';
import Since from './util/since';
import config from '../../../config/app';

let socket = io('http://localhost:1664')

var debug = Debug('app.root');

class AppRoot extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            stats: [],
            displayStats: [],
            total: 0,
            nbMsg: 0,
            lastRequest:new Date(),
            query: config.graylog.query.query,
            periods: config.graylog.periods
        };

        this.interval = this.timer = null;
        this.fields = ['app', 'app_version', 'msg'];

        socket.on('stats:download:progress', data => {
            this.setState({
                total: data.total,
                nbMsg: data.nbMsg
            });
        }).on('stats:download:content', data => {
            this.setState({
                stats: data.stats,
                lastRequest: new Date()
            });

            this.filterStats();
        }).on('stats:download:error', data => {
            this.setState({
                stats:[],
                displayStats:[]
            });
        }).on('stats:download:need', data => {
            this.refresh(false);
        });
    }

    refresh ( manualSend ) {
        if (!manualSend && !this.refs.autoRefresh.getDOMNode().checked) {
            return;
        }
        var params = {
            range: parseInt(this.refs.period.getDOMNode().value.trim()),
            query: this.refs.query.getDOMNode().value.trim()
        };
        if (params.query.length == 0) {
            params.query = '*';
        }

        socket.emit( 'client:request:new', params);
    }

    filterStats () {
        if (this.timer != null) {
            clearTimeout( this.timer );
        }

        var rules = this.fields.map((field) => {
            var value = React.findDOMNode(this.refs[field]).value.trim();
            if (value.length == 0 ) {
                return false;
            }

            return { regex: new RegExp(value, 'i'), field: field};
        }).filter( (rule) => { return rule;} );

        this.timer = setTimeout(() => {
            this.setState({ displayStats: [] });

            if (rules.length == 0) {
                this.setState({ displayStats: this.state.stats });
                return true;
            }

            this.state.displayStats = this.state.stats.filter((el) => {
                return rules.filter( ( rule ) => {
                    return !rule.regex.test(el[rule.field]);
                }).length == 0;
            });

            this.setState({ displayStats: this.state.displayStats });
        }, 500)
    }

    componentDidMount () {
        this.refresh(true);
    }

    render () {
        var graylogMsg = this.state.displayStats.map((stat) => {
            return (
                <GraylogMsg message={ stat } />
            );
        });

        graylogMsg.unshift( <GraylogMsg /> );

        var forms = this.fields.map((el) => {
            return (
                <input type="text" placeholder={ el } ref={ el }
                    onChange={ this.filterStats.bind(this) } />
            );
        });

        var since = '';
        if (this.state.lastRequest instanceof Date) {
            since = <Since date={ this.state.lastRequest } />;
        }

        var periods = this.state.periods.map((el) => {
            return (
                <option value={ el.value } >{ el.name }</option>
            );
        });

        return <div className='appRoot small-12'>
            <div className='row table'>
                <div className='graylogMsg row'>
                    <div className='small-9 columns text-center'>
                        <input type='text'
                            placeholder='query'
                            ref='query'
                            defaultValue={ this.state.query } />
                    </div>
                    <div className='small-2 columns text-center'>
                        <label> <input type='checkbox'
                                defaultChecked={ true }
                                ref='autoRefresh' />auto-refresh</label>
                    </div>
                    <div className='small-1 columns text-center'>
                        <button className="btn-refresh button"
                            onClick={ this.refresh.bind( this, true) }></button>
                    </div>
                    <div className='small-2 columns text-center'>
                        <select ref='period' > { periods } </select>
                    </div>
                    <div className='small-2 columns text-center'> { forms[0] }</div>
                    <div className='small-2 columns text-center'> { forms[1] }</div>
                    <div className='small-2 columns text-center'> { forms[2] }</div>
                    <div className='small-3 columns text-right'>
                         { since } -
                         <span> { this.state.nbMsg } / { this.state.total }</span>
                    </div>
                </div>
                { graylogMsg }
            </div>
        </div>;
    }
}

export default AppRoot;
