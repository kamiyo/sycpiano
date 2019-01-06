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

const ContactContainer = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    overflow-x: hidden;
    overflow-y: unset;

    ${screenXSorPortrait} {
        overflow-y: scroll;
        justify-content: space-around;
    }
`;

class Contact extends React.PureComponent<ContactProps> {
    render() {
        return (
            <ContactContainer
                onScroll={this.props.isMobile ? scrollFn(navBarHeight.mobile, this.props.onScroll) : null}
            >
                {contacts.map((contact, i) => (
                    <StyledContactItem {...contact} key={i} />
                ))}
            </ContactContainer>
        );
    }
}

const ConnectedContact = connect<{}, ContactDispatchToProps>(
    null,
    { onScroll },
)(Contact);

export type ContactType = React.Component<ContactProps>;
export type RequiredProps = ContactOwnProps;
export default ConnectedContact;
