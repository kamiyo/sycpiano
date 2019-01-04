import * as React from 'react';
import { connect } from 'react-redux';

import styled from '@emotion/styled';

import { setOnScroll } from 'src/components/App/NavBar/actions';
import StyledContactItem from 'src/components/Contact/ContactItem';
import contacts from 'src/components/Contact/contacts';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { GlobalStateShape } from 'src/types';

interface ContactOwnProps {
    isMobile: boolean;
    className?: string;
}

interface ContactStateToProps {
    onScroll: (event: React.SyntheticEvent<HTMLElement>) => void;
}

interface ContactDispatchToProps {
    setOnScroll: typeof setOnScroll;
}

type ContactProps = ContactOwnProps & ContactStateToProps & ContactDispatchToProps;

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

class Contact extends React.Component<ContactProps> {
    componentDidMount() {
        this.props.setOnScroll(navBarHeight.mobile);
    }

    render() {
        return (
            <ContactContainer
                onScroll={this.props.isMobile ? this.props.onScroll : null}
            >
                {contacts.map((contact, i) => (
                    <StyledContactItem {...contact} key={i} />
                ))}
            </ContactContainer>
        );
    }
}

const mapStateToProps = ({ navbar }: GlobalStateShape): ContactStateToProps => ({
    onScroll: navbar.onScroll,
});

const ConnectedContact = connect<ContactStateToProps, ContactDispatchToProps>(
    mapStateToProps,
    { setOnScroll },
)(Contact);

export type ContactType = React.Component<ContactProps>;
export type RequiredProps = ContactOwnProps;
export default ConnectedContact;
