import '@/less/Schedule/syc-calendar.less';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';

import Calendar from 'rc-calendar';

const ConnectedSycCalendar = ({ date, onChange }) => (
    <Calendar
        prefixCls='syc-calendar'
        showDateInput={false}
        showToday={false}
        enablePrev={true}
        enableNext={true}
        onChange={onChange}
        value={date}
    />
);

const mapStateToProps = state => ({ date: state.schedule_date });

const mapDispatchToProps = dispatch => ({
    onChange: date => dispatch({type: 'SCHEDULE--UPDATE_DATE', date})
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedSycCalendar);
