import 'react-dates/lib/css/_datepicker.css';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { DayPickerSingleDateController } from 'react-dates';

const ConnectedSycCalendar = ({ date, onDateChange }) => (
    <DayPickerSingleDateController
        numberOfMonths={1}
        focused={true}
        date={date}
        onDateChange={onDateChange}
    />
);

const mapStateToProps = state => ({ date: state.schedule_date });

const mapDispatchToProps = dispatch => ({
    onDateChange: date => dispatch({type: 'SCHEDULE--UPDATE_DATE', date})
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedSycCalendar);
