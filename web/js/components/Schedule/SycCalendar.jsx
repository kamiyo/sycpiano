import '@/less/syc-calendar.less';

import React from 'react';

import Calendar from 'rc-calendar';

export default class SycCalendar extends React.Component {
    render() {
        return <Calendar
            prefixCls='syc-calendar'
            showDateInput={false}
            showToday={false}
            enablePrev={true}
            enableNext={true}
        />
    }
}
