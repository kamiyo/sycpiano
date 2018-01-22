import * as React from 'react';
import styled from 'react-emotion';

import { ContactItem } from 'src/components/Contact/ContactItem';
import contacts from 'src/components/Contact/contacts';

import { pushed } from 'src/styles/mixins';

const ContactContainer = styled('div')`
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
`;

const FlexContactItem = styled(ContactItem)`
    flex: 1 0 auto;
    ${pushed};
`;

const Contact: React.SFC<{}> = () => (
    <ContactContainer>
        {contacts.map((contact, i) => (
            <FlexContactItem {...contact} key={i} />
        ))}
    </ContactContainer>
);

export default Contact;
