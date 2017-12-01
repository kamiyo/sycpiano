import 'less/Contact/contact.less';

import * as React from 'react';

import ContactItem from 'src/components/Contact/ContactItem';
import contacts from 'src/components/Contact/contacts';

const Contact: React.SFC<{}> = () => (
    <div className='contactContainer'>
        {contacts.map((contact, i) => <ContactItem {...contact} key={i} />)}
    </div>
);

export default Contact;
