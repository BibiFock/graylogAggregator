import React from 'react/addons';
import humanize from 'humanize';

class since extends React.Component {

    constructor (props) {
        super(props);
        this.state = props;

        setInterval(
            () => {
                this.setState({
                    date: this.state.date
                });
            },
            1000
        );
    }

    componentWillReceiveProps (nextProps) {
        this.setState({ date: nextProps.date });
    }

    render () {
        var time = humanize.relativeTime(this.state.date.getTime() / 1000);

        return <span className="since">{ time }</span>;
    }
}

export default since;
