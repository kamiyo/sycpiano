import * as React from 'react';
import { connect } from 'react-redux';

import styled from '@emotion/styled';

import { onScroll, scrollFn } from 'src/components/App/NavBar/actions';
import StyledContactItem from 'src/components/Contact/ContactItem';
import contacts from 'src/components/Contact/contacts';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

interface ContactOwnProps {
    isMobile: boolean;
    className?: string;
}

interface ContactDispatchToProps {
    onScroll: typeof onScroll;
}

type ContactProps = ContactOwnProps & ContactDispatchToProps;

const ContactContainer = styled.div({
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    overflowX: 'hidden',
    overflowY: 'unset',
    [screenXSorPortrait]: {
        overflowY: 'scroll',
        justifyContent: 'space-around',
    },
});

const Contact: React.FC<ContactProps> = ({ isMobile, onScroll: onScrollAction }) => (
    <ContactContainer
        onScroll={isMobile ? scrollFn(navBarHeight.mobile, onScrollAction) : null}
    >
        {contacts.map((contact, i) => (
            <StyledContactItem {...contact} key={i} />
        ))}
    </ContactContainer>
);

const ConnectedContact = connect<Record<string, never>, ContactDispatchToProps>(
    null,
    { onScroll },
)(Contact);

export type ContactType = typeof Contact;
export type RequiredProps = ContactOwnProps;
export default ConnectedContact;
