import _ from 'lodash';
import React from 'react';

import EventListMonth from '@/js/components/Schedule/EventListMonth.jsx';

// Test data for now
const eventsByMonth = {
    'November': [
        {
            name: 'Lights, Camera, Action!',
            day: 18,
            time: '7:00PM',
            program: [
                'this is the first piece',
                'this is the second piece',
                'this is the third piece',
            ],
            collaborators: [
                'an orchestra',
                'a violinist',
                'an organist',
                'a dog',
            ],
        },
        {
            name: 'Lights, Camera, Action!',
            day: 19,
            time: '7:00PM',
            program: [
                'this is the first piece',
                'this is the second piece',
                'this is the third piece',
            ],
            collaborators: [
                'an orchestra',
                'a violinist',
                'an organist',
                'a dog',
            ],
        },
        {
            name: 'Lights, Camera, Action!',
            day: 20,
            time: '7:00PM',
            program: [
                'this is the first piece',
                'this is the second piece',
                'this is the third piece',
            ],
            collaborators: [
                'an orchestra',
                'a violinist',
                'an organist',
                'a dog',
            ],
        }
    ]
};

export default class EventList extends React.Component {
    render() {
        return (
            <div className="event-list">
                {
                    _.map(eventsByMonth, (events, month) => {
                        return <EventListMonth month={month} events={events} key={month}/>
                    })
                }
            </div>
        );
    }
}
