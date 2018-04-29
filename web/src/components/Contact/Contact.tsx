import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

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

class Contact extends React.Component<ContactProps> {
    componentDidMount() {
        this.props.setOnScroll(navBarHeight.mobile);
    }

    render() {
        return (
            <div
                onScroll={this.props.isMobile ? this.props.onScroll : null}
                className={this.props.className}
            >
                {contacts.map((contact, i) => (
                    <StyledContactItem {...contact} key={i} />
                ))}
            </div>
        );
    }
}

const StyledContact = styled<ContactProps, typeof Contact>(Contact) `
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    overflow-y: unset;
    overflow-x: hidden;

    ${/* sc-selector */ screenXSorPortrait} {
        overflow-y: scroll;
        justify-content: space-around;
    }
`;

const mapStateToProps = ({ navbar }: GlobalStateShape): ContactStateToProps => ({
    onScroll: navbar.onScroll,
});

const ConnectedContact = connect<ContactStateToProps, ContactDispatchToProps>(
    mapStateToProps,
    { setOnScroll },
)(StyledContact);

export type ContactType = typeof ConnectedContact;
export default ConnectedContact;
