import 'react-dates/lib/css/_datepicker.css';

import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { DayPickerSingleDateController } from 'react-dates';

class ConnectedSycCalendar extends React.Component {
    onPrevMonthClick = () => {
        const newDate = moment(this.props.date).subtract(1, 'month');
        this.props.onDateChange(newDate);
    }

    onNextMonthClick = () => {
        const newDate = moment(this.props.date).add(1, 'month');
        this.props.onDateChange(newDate);
    }

    isDayHighlighted = (date) => {

    }

    render() {
        return (
            <DayPickerSingleDateController
                numberOfMonths={1}
                focused={true}
                date={this.props.date}
                onDateChange={this.props.onDateChange}
                onPrevMonthClick={this.onPrevMonthClick}
                onNextMonthClick={this.onNextMonthClick}
                isDayHighlighted={this.isDayHighlighted}
            />

        )
    }
}

const mapStateToProps = state => ({
    date: state.schedule_date,
});

const mapDispatchToProps = dispatch => ({
    onDateChange: date => dispatch({type: 'SCHEDULE--UPDATE_DATE', date}),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedSycCalendar);
