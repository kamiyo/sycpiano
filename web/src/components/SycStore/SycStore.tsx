import styled from '@emotion/styled';
import mix from 'polished/lib/color/mix';
import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

<<<<<<< HEAD
import { addItemToCartAction, fetchItemsAction } from 'src/components/SycStore/actions';
import { ConnectedCart as Cart } from 'src/components/SycStore/Cart';
=======
import { RouteComponentProps } from 'react-router';
import { Route, Switch, withRouter } from 'react-router-dom';
import { fetchItemsAction } from 'src/components/SycStore/actions';
>>>>>>> origin/add_store_checkout
import { StoreItemsList } from 'src/components/SycStore/StoreItemsList';
import { StoreCart, StoreItem } from 'src/components/SycStore/types';
import { GlobalStateShape } from 'src/types';

import { magenta } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';
import { pushed } from 'src/styles/mixins';

const SycStoreContainer = styled.div`
    ${pushed}
    overflow-y: scroll;
    background-color: #f7f7f7;
`;

interface CheckoutButtonOwnProps {
    readonly children: React.ReactNode;
    readonly route: string;
    readonly className?: string;
}

type CheckoutButtonProps = CheckoutButtonOwnProps & RouteComponentProps;

const CheckoutButton = withRouter(
    ({ history, children, route, className }: CheckoutButtonProps) => (
        <button className={className} onClick={() => history.push(route)}>
            {children}
        </button>
    ));

const StyledCheckoutButton = styled(CheckoutButton)`
    position: absolute;
    right: 20px;
    top: 98px;
    font-size: 1.2em;
    width: 230px;
    padding: 10px;
    text-align: center;
    border-radius: 4px;
    font-family: ${lato2};
    background-color: ${magenta};
    color: #fff;
    transition: all 0.25s;

    &:hover {
        background-color: ${mix(0.75, magenta, '#FFF')};
        color: white;
        cursor: pointer;
    }
`;

const StyledStoreItemsList = styled(StoreItemsList)`
    margin: 0 auto;
`;

interface SycStoreStateToPros {
    readonly items: StoreItem[];
    readonly cart: StoreCart;
}

interface SycStoreDispatchToProps {
    readonly fetchItemsAction: () => Promise<void>;
    readonly addItemToCart: (sku: string) => void;
}

interface SycOwnProps { isMobile: boolean; }

type SycStoreProps = SycOwnProps & SycStoreStateToPros & SycStoreDispatchToProps;

class SycStore extends React.PureComponent<SycStoreProps, {}> {
    componentDidMount() {
        this.props.fetchItemsAction();
    }

    render() {
        const cartHasItems = !!this.props.cart.items.length;
        return (
            <SycStoreContainer>
<<<<<<< HEAD
                <StyledStoreItemsList
                    isMobile={this.props.isMobile}
                    items={this.props.items}
                    addItemToCart={this.props.addItemToCart}
                />
                <Cart />
=======
                <Switch>
                    <Route
                        path="/store"
                        exact={true}
                        render={() => (
                            <>
                                {
                                    cartHasItems &&
                                        <StyledCheckoutButton route={'/store/checkout'}>
                                            {`Checkout`}
                                        </StyledCheckoutButton>

                                }
                                <StyledStoreItemsList
                                    isMobile={this.props.isMobile}
                                    items={this.props.items}
                                />
                            </>
                        )}
                    />
                    <Route
                        path="/store/checkout"
                        exact={true}
                        render={() => null}
                    />
                </Switch>
>>>>>>> origin/add_store_checkout
            </SycStoreContainer>
        );
    }
}

const mapStateToProps = ({ sycStore }: GlobalStateShape) => ({
    items: sycStore.items,
    cart: sycStore.cart,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<GlobalStateShape, undefined, Action>) => ({
    fetchItemsAction: () => dispatch(fetchItemsAction()),
    addItemToCart: (sku: string) => dispatch(addItemToCartAction(sku)),
});

const connectedSycStore = connect<SycStoreStateToPros, SycStoreDispatchToProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(SycStore);

export type SycStoreType = new (props: any) => React.Component<SycStoreProps>;
export type RequiredProps = SycOwnProps;
export default connectedSycStore;
