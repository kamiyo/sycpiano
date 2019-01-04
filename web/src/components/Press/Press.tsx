import * as React from 'react';
import { connect } from 'react-redux';

import styled from '@emotion/styled';

import { setOnScroll } from 'src/components/App/NavBar/actions';
import AcclaimsList from 'src/components/Press/AcclaimsList';

import { container, pushed } from 'src/styles/mixins';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { GlobalStateShape } from 'src/types';

interface PressStateToProps {
    readonly onScroll: (event: React.SyntheticEvent<HTMLElement>) => void;
}

interface PressDispatchToProps {
    readonly setOnScroll: typeof setOnScroll;
}

interface PressOwnProps {
    className?: string;
    isMobile?: boolean;
}

type PressProps = PressStateToProps & PressDispatchToProps & PressOwnProps;

const PressContainer = styled.div(
    pushed,
    container,
    {
        boxSizing: 'border-box',
        position: 'absolute',
        width: '100%',
        top: 0,
        [screenXSorPortrait]: {
            marginTop: 0,
            height: '100%',
        },
    },
);

class Press extends React.Component<PressProps> {
    componentDidMount() {
        this.props.isMobile && this.props.setOnScroll(navBarHeight.mobile);
    }

    render() {
        return (
            <PressContainer onScroll={this.props.isMobile ? this.props.onScroll : null}>
                <AcclaimsList isMobile={this.props.isMobile} />
            </PressContainer>
        );
    }
}

const mapStateToProps = ({ navbar }: GlobalStateShape): PressStateToProps => ({
    onScroll: navbar.onScroll,
});

const mapDispatchToProps: PressDispatchToProps = {
    setOnScroll,
};

const ConnectedPress = connect<PressStateToProps, PressDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Press);

export type PressType = React.Component<PressProps>;
export type RequiredProps = PressOwnProps;
export default ConnectedPress;
