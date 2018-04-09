import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect } from 'react-redux';

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

class Press extends React.Component<PressProps> {
    componentDidMount() {
        this.props.isMobile && this.props.setOnScroll(navBarHeight.mobile);
    }

    render() {
        return (
            <div className={this.props.className} onScroll={this.props.isMobile ? this.props.onScroll : null}>
                <AcclaimsList className={css ` height: 100%; `} isMobile={this.props.isMobile} />
            </div>
        );
    }
}

const StyledPress = styled(Press) `
    ${pushed}
    ${container}
    box-sizing: border-box;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;

    ${/* sc-selector */ screenXSorPortrait} {
        margin-top: 0;
        height: 100%;
    }
`;

const mapStateToProps = ({ navbar }: GlobalStateShape): PressStateToProps => ({
    onScroll: navbar.onScroll,
});

const mapDispatchToProps: PressDispatchToProps = {
    setOnScroll,
};

const ConnectedPress = connect<PressStateToProps, PressDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(StyledPress);

export type PressType = typeof ConnectedPress;
export default ConnectedPress;
