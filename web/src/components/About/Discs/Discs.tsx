import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import styled from '@emotion/styled';

import { fetchDiscsAction } from 'src/components/About/Discs/actions';
import DiscList from 'src/components/About/Discs/DiscList';
import { Disc } from 'src/components/About/Discs/types';
import { onScroll, scrollFn } from 'src/components/App/NavBar/actions';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

const StyledDiscs = styled.div`
    ${pushed}
    width: 100%;
    background-color: rgb(238, 238, 238);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    ${screenXSorPortrait} {
        height: 100%;
        margin-top: 0;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
`;

interface DiscsOwnProps {
    readonly isMobile: boolean;
}

interface DiscsStateToProps {
    readonly items: Disc[];
}

interface DiscsDispatchToProps {
    readonly onScroll: (triggerHeight: number, scrollTop: number) => void;
    readonly fetchDiscsAction: () => Promise<void>;
}

type DiscsProps = DiscsOwnProps & DiscsDispatchToProps & DiscsStateToProps;

class Discs extends React.PureComponent<DiscsProps> {
    componentDidMount() {
        this.props.fetchDiscsAction();
    }

    render() {
        return (
            <StyledDiscs
                onScroll={this.props.isMobile ? scrollFn(navBarHeight.mobile, this.props.onScroll) : null}
            >
                <DiscList
                    items={this.props.items}
                    isMobile={this.props.isMobile}
                />
            </StyledDiscs>
        );
    }
}

const mapStateToProps = ({ discs }: GlobalStateShape): DiscsStateToProps => ({
    items: discs.discs,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<GlobalStateShape, undefined, Action>) => ({
    onScroll: (triggerHeight: number, scrollTop: number) => dispatch(onScroll(triggerHeight, scrollTop)),
    fetchDiscsAction: () => dispatch(fetchDiscsAction()),
});

const ConnectedDiscs = connect<DiscsStateToProps, DiscsDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Discs);

export type DiscsType = React.Component<DiscsProps>;
export type RequiredProps = DiscsOwnProps;
export default ConnectedDiscs;
