import * as React from 'react';
import styled from 'react-emotion';

import { ContactItem } from 'src/components/Contact/ContactItem';
import contacts from 'src/components/Contact/contacts';

interface ContactProps { isMobile: boolean }
type ContactContainerProps = ContactProps;

const ContactContainer = styled<ContactContainerProps, 'div'>('div')`
    display: flex;
    flex-flow: row wrap;
    justify-content: ${(props) => props.isMobile ? 'space-around' : 'center'};
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    overflow-y: ${(props) => props.isMobile ? 'scroll' : 'default'};
`;

const Contact: React.SFC<ContactProps> = (props) => (
    <ContactContainer isMobile={props.isMobile}>
        {contacts.map((contact, i) => (
            <ContactItem {...contact} key={i} />
        ))}
    </ContactContainer>
);

export type ContactType = typeof Contact;
export default Contact;
