import { ContactItemShape } from 'src/components/Contact/types';

const contacts: ContactItemShape[] = [
    {
        name: 'Sean Chen',
        className: 'seanChen',
        title: 'Concert Pianist',
        email: 'seanchen@seanchenpiano.com',
        social: {
            facebook: 'https://www.facebook.com/seanchenpiano',
            twitter: 'https://twitter.com/seanchenpiano',
            youtube: 'https://www.youtube.com/user/SeanChenPiano',
            linkedin: 'https://www.linkedin.com/in/seanchenpiano',
            instagram: 'https://www.instagram.com/seanchenpiano',
        },
    },
    {
        name: 'Joel Harrison',
        className: 'joelHarrison',
        title: 'Artistic Director, President/CEO',
        organization: 'American Pianists Association',
        phone: '317.940.9947',
        email: 'joel@americanpianists.org',
        social: {
            facebook: 'https://www.facebook.com/AmericanPianistsAssociation/?ref=search',
            twitter: 'https://twitter.com/APApianists',
            youtube: 'https://www.youtube.com/user/apaPianists',
            instagram: 'https://www.instagram.com/apapianists/',
        },
    },
];

export default contacts;
