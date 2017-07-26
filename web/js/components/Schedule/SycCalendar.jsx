import 'react-dates/lib/css/_datepicker.css';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { DayPickerSingleDateController } from 'react-dates';

class ConnectedSycCalendar extends React.Component {
    onPrevMonthClick = () => {
        const newDate = moment(this.props.date.date).subtract(1, 'month');
        this.props.onDateChange(newDate);
    }

    onNextMonthClick = () => {
        const newDate = moment(this.props.date.date).add(1, 'month');
        this.props.onDateChange(newDate);
    }

    isDayBlocked = (date) => {
        return this.props.events.items.every((element) => (element.type === 'month' || !date.isSame(element.dateTime, 'day')));
    }

    isDayHighlighted = (date) => {
        return this.props.events.items.find((element) => (element.type === 'day' && date.isSame(element.dateTime, 'day')));
    }

    render() {
        return (
            <DayPickerSingleDateController
                numberOfMonths={1}
                focused={this.props.date.eventsFetched}
                date={this.props.date.date}
                onDateChange={this.props.onDateChange}
                onPrevMonthClick={this.onPrevMonthClick}
                onNextMonthClick={this.onNextMonthClick}
                isOutsideRange={this.isDayBlocked}
                onFocusChange={this.onFocusChange}
            />
        )
    }
}

const mapStateToProps = state => ({
    date: state.schedule_date,
    events: state.schedule_eventItems
});

const mapDispatchToProps = dispatch => ({
    onDateChange: date => {
        dispatch({type: 'SCHEDULE--UPDATE_DATE', date});
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedSycCalendar);
