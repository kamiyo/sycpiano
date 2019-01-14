import styled from '@emotion/styled';
import * as React from 'react';
import { connect } from 'react-redux';
import { fetchItemsAction } from 'src/components/SycStore/actions';
import { StoreItemsList } from 'src/components/SycStore/StoreItemsList';
import { StoreItem } from 'src/components/SycStore/types';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';

const SycStoreContainer = styled.div`
    ${pushed}
    overflow-y: scroll;
    background-color: #ebebeb;
`;

const StyledStoreItemsList = styled(StoreItemsList)`
    margin: 0 auto;
`;

interface SycStoreStateToPros {
    readonly items: StoreItem[];
}

interface SycStoreDispatchToProps {
    readonly fetchItemsAction: typeof fetchItemsAction;
}

interface SycOwnProps { isMobile: boolean; }

type SycStoreProps = SycOwnProps & SycStoreStateToPros & SycStoreDispatchToProps;

class SycStore extends React.PureComponent<SycStoreProps, {}> {
    componentDidMount() {
        this.props.fetchItemsAction();
    }

    render() {
        return (
            <SycStoreContainer>
                <StyledStoreItemsList
                    isMobile={this.props.isMobile}
                    items={this.props.items}
                />
            </SycStoreContainer>
        );
    }
}

const mapStateToProps = ({ sycStore }: GlobalStateShape) => ({
    items: sycStore.items,
});

const connectedSycStore = connect<SycStoreStateToPros, SycStoreDispatchToProps, {}>(
    mapStateToProps,
    { fetchItemsAction },
)(SycStore);

export type SycStoreType = new (props: any) => React.Component<SycStoreProps>;
export type RequiredProps = SycOwnProps;
export default connectedSycStore;
