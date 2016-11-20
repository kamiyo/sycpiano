import '@/less/syc-calendar.less';

import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';

import Calendar from 'rc-calendar';

class SycCalendarPresentation extends React.Component {
    render() {
        return <Calendar
            prefixCls='syc-calendar'
            showDateInput={false}
            showToday={false}
            enablePrev={true}
            enableNext={true}
            onChange={this.props.onChange}
            value={this.props.date}
        />
    }
}

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: date => dispatch({type: 'UPDATE_DATE', date})
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SycCalendarPresentation);
