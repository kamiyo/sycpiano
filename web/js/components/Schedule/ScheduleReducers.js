import moment from 'moment';

// Test data for now
const dummyEventsByMonth = {
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
    ],
};

export const dateReducer = (state = moment(), action) => {
    switch (action.type) {
        case 'UPDATE_DATE':
            return action.date;
        default:
            return state;
    };
};

export const eventsByMonthReducer = (state = dummyEventsByMonth, action) => {
    switch (action.type) {
        case 'UPDATE_EVENTS_BY_MONTH':
            return action.eventByMonth;
        default:
            return state;
    };
};
