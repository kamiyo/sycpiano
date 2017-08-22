import 'react-dates/lib/css/_datepicker.css';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { DayPickerSingleDateController } from 'react-dates';
import '@/less/Schedule/syc-calendar.less';

class ConnectedSycCalendar extends React.Component {
    onPrevMonthClick = () => {
        const newDate = moment(this.props.date.date).subtract(1, 'month');
        this.props.onDateChange(newDate);
    }

    onNextMonthClick = () => {
        const newDate = moment(this.props.date.date).add(1, 'month');
        this.props.onDateChange(newDate);
    }

    onDayClick = (date) => {
        this.props.onDateChange(date);
    }

    isDayBlocked = (date) => {
        return !this.isDayHighlighted(date);
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
                onDateChange={this.onDayClick}
                onPrevMonthClick={this.onPrevMonthClick}
                onNextMonthClick={this.onNextMonthClick}
                isOutsideRange={this.isDayBlocked}
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
