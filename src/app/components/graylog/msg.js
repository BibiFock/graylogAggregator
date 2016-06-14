import React from 'react/addons';
import humanize from 'humanize';
import Debug from 'debug';

import Detail from './detail';

var debug = Debug('app.graylog.msg');

class msg extends React.Component {

    constructor (props) {
        super(props);
        props.message.hideDetail = true;
        this.state = props.message;
    }

    toggleDetail() {
        this.setState({
            hideDetail: !this.state.hideDetail
        });
    }


    stopPropagation(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    render () {
        var details = this.state.messages.map((stat) => {
            return (
                <Detail data={ stat } />
            );
        });
        details.unshift(
            <Detail />
        );
        var detailClass = 'row small-12 ' +
            (this.state.hideDetail ? 'hide' : '');

        return <div className="graylogMsg">
            <div className="row columns" onClick={ this.toggleDetail.bind(this) }>
                <div className="small-1 columns text-right"> { humanize.numberFormat(this.state.total, 0) } </div>
                <div className="small-2 columns">{ this.state.app }</div>
                <div className="small-2 columns">{ this.state.app_version }</div>
                <div className="small-7 columns">{ this.state.msg }</div>
            </div>
            <div className={ detailClass } onClick={ this.stopPropagation }>
                { details }
            </div>
        </div>;
    }
}

export default msg;
