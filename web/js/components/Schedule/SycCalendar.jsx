import 'react-dates/lib/css/_datepicker.css';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { DayPicker } from 'react-dates';

import Calendar from 'rc-calendar';

const ConnectedSycCalendar = ({ date, onChange }) => (
    <DayPicker
        numberOfMonths={1}
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
