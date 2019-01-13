import * as React from 'react';
import { connect } from 'react-redux';

import styled from '@emotion/styled';

import AcclaimsList from 'src/components/About/Press/AcclaimsList';
import { onScroll, scrollFn } from 'src/components/App/NavBar/actions';

import { container, pushed } from 'src/styles/mixins';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { GlobalStateShape } from 'src/types';

interface PressStateToProps {
    readonly onScroll: (event: React.SyntheticEvent<HTMLElement>) => void;
}

interface PressDispatchToProps {
    readonly onScroll: typeof onScroll;
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

class Press extends React.PureComponent<PressProps> {
    render() {
        return (
            <PressContainer onScroll={this.props.isMobile ? scrollFn(navBarHeight.mobile, this.props.onScroll) : null}>
                <AcclaimsList isMobile={this.props.isMobile} />
            </PressContainer>
        );
    }
}

const mapStateToProps = ({ navbar }: GlobalStateShape): PressStateToProps => ({
    onScroll: navbar.onScroll,
});

const ConnectedPress = connect<PressStateToProps, PressDispatchToProps>(
    mapStateToProps,
    { onScroll },
)(Press);

export type PressType = React.Component<PressProps>;
export type RequiredProps = PressOwnProps;
export default ConnectedPress;
