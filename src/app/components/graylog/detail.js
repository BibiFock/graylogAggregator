import React from 'react/addons';
import humanize from 'humanize';
import Debug from 'debug';

import config from '../../../../config/app';

var debug = Debug('app.graylog.detail');

class detail extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            data: props.data,
            columns: config.graylog.columns.detail
        }
    }

    openLink (e) {
        if ( !this.state.data ) {
            e.stopPropagation();
        }

        window.open(
            'http://' + config.graylog.url + ':' + config.graylog.port.web
            + config.graylog.linkPath + this.state.data._id,
            '_blank'
        );
    }

    render () {
        var columns = this.state.columns.map( (column, i) => {
            var cl = 'small-' + column.space + ' columns';
            var value = column.name;
            if (value != 'url') {
                cl += ' text-center';
            }
            if (this.state.data) {
                if (value == 'time') {
                    value = humanize.relativeTime(
                        ( new Date(this.state.data.timestamp) ).getTime() / 1000
                    );
                } else {
                    value = this.state.data[value];
                }
            } else {
                cl += ' title text-center';
            }
            return (
                <div className={ cl } key={i}>{ value }</div>
            );
        });
        var cl = 'graylogDetail columns row';
        if (!this.state.data) {
            cl += ' title';
        }
        return <div className={ cl } onClick={ this.openLink.bind(this) }>
            { columns }
        </div>;
    }
}

export default detail;
