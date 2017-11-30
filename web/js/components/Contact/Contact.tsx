import 'less/Contact/contact.less';

import * as React from 'react';

import ContactItem from 'js/components/Contact/ContactItem';
import contacts from 'js/components/Contact/contacts';

const Contact = () => (
    <div className='contactContainer'>
        {contacts.map((contact, i) => <ContactItem {...contact} key={i} />)}
    </div>
);

export default Contact;
