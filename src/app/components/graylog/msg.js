import React from 'react/addons';
import humanize from 'humanize';
import Debug from 'debug';

import Detail from './detail';
import config from '../../../../config/app';

var debug = Debug('app.graylog.msg');

var _getColClass = (space, center) => {
    return 'columns small-' + space + (center ? ' center-text' : '');
};

class msg extends React.Component {

    constructor (props) {
        super(props);
        if (props.message) {
            props.message.hideDetail = true;
            this.state = props.message;
        } else {
            this.state = { isTitle: true };
        }

        this.state.columns = config.graylog.columns.message;
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

    render() {
        if ( this.state.isTitle ) {
            return this.renderTitle();
        }

        return this.renderMsg();
    }

    renderTitle() {
        var columns = this.state.columns.map( (col, i) => {
            return <div className={ _getColClass(col.space, true) } key={ i } >
                { col.name }
            </div>
        });
        return <div className="graylogMsg graylogMsg-title">
            <div className="row columns" >
                <div className="small-1 columns right-text" key={ columns.length }> total </div>
                { columns }
            </div>
        </div>;
    }

    renderMsg () {
        var details = this.state.messages.map( (stat, index) => {
            return (
                <Detail data={ stat } key={ index }/>
            );
        });
        details.unshift( <Detail key={ details.length } />);

        var detailClass = 'row small-12 ' +
            (this.state.hideDetail ? 'hide' : '');
        var columns = this.state.columns.map( (col, index) => {
            var cl = _getColClass(col.space);
            return <div className={ cl } key={ index } > { this.state[col.name] } </div>;
        });

        return <div className="graylogMsg">
            <div className="row columns" onClick={ this.toggleDetail.bind(this) } >
                <div className="small-1 columns right-text" >
                    { humanize.numberFormat( this.state.total, 0) }
                </div>
                { columns }
            </div>
            <div className={ detailClass } onClick={ this.stopPropagation } >
                { details }
            </div>
        </div>;

    }
}

export default msg;
