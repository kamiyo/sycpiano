import * as React from 'react';
import styled from 'react-emotion';

import { ContactItem } from 'src/components/Contact/ContactItem';
import contacts from 'src/components/Contact/contacts';

const ContactContainer = styled('div')`
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
`;

const Contact: React.SFC<{ isMobile: boolean; }> = () => (
    <ContactContainer>
        {contacts.map((contact, i) => (
            <ContactItem {...contact} key={i} />
        ))}
    </ContactContainer>
);

export type ContactType = typeof Contact;
export default Contact;
