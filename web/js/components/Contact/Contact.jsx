import 'less/Contact/contact.less'

import React from 'react';
import ContactItem from 'js/components/Contact/ContactItem.jsx';
import contacts from 'js/components/Contact/contacts.js';

/**
 * <div className='emailContainer'>
    <a href='mailto:seanchen@seanchenpiano.com'>seanchen@seanchenpiano.com</a>
</div>
 */

const Contact = () => (
    <div className='contactContainer'>
        {contacts.map((contact, i) => <ContactItem {...contact} key={i} />)}
    </div>
);

export default Contact;
