import { ContactItemShape } from 'src/components/Contact/types';

const contacts: ContactItemShape[] = [
    {
        name: 'Sean Chen',
        className: 'seanChen',
        position: [
            {
                title: 'Pianist | Composer | Arranger',
            },
            {
                title: 'Artist-in-Residence',
                organization: 'University of Missouri-Kansas City Conservatory',
            },
        ],
        email: ['seanchen@seanchenpiano.com', 'chensy@umkc.edu'],
        social: {
            facebook: 'https://www.facebook.com/seanchenpiano',
            twitter: 'https://twitter.com/seanchenpiano',
            youtube: 'https://www.youtube.com/user/SeanChenPiano',
            linkedin: 'https://www.linkedin.com/in/seanchenpiano',
            instagram: 'https://www.instagram.com/seanchenpiano',
        },
    },
    {
        name: 'Martha Woods',
        className: 'marthaWoods',
        position: [{
            title: 'President',
            organization: 'Jonathan Wentworth Associates',
        }],
        phone: ['(301) 277-8205'],
        email: ['martha@jwentworth.com'],
        social: {
            web: 'https://www.jwentworth.com/contact/',
        },
    },
];

export default contacts;
