import styled from '@emotion/styled';
import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Route, Switch } from 'react-router-dom';
import { fetchItemsAction, addItemToCartAction } from 'src/components/Shop/actions';
import { ShopItemsList } from 'src/components/Shop/ShopItemsList';
import { ConnectedCart } from 'src/components/Shop/Cart';
import { ShoppingCart, ShopItem } from 'src/components/Shop/types';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';

const ShopContainer = styled.div`
    ${pushed}
    overflow-y: scroll;
    background-color: #f7f7f7;
`;

const StyledShopItemsList = styled(ShopItemsList)`
    margin: 0 auto;
`;

interface ShopStateToPros {
    readonly items: ShopItem[];
    readonly cart: ShoppingCart;
}

interface ShopDispatchToProps {
    readonly fetchItemsAction: () => Promise<void>;
}

interface ShopOwnProps { isMobile: boolean; }

type ShopProps = ShopOwnProps & ShopStateToPros & ShopDispatchToProps;

class Shop extends React.PureComponent<ShopProps, {}> {
    componentDidMount() {
        this.props.fetchItemsAction();
    }

    render() {
        return (
            <ShopContainer>
                <StyledShopItemsList
                    isMobile={this.props.isMobile}
                    items={this.props.items}
                />
                <Switch>
                    <Route
                        path="/store"
                        exact={true}
                        component={ConnectedCart}
                    />
                    <Route
                        path="/store/checkout"
                        exact={true}
                        render={() => null}
                    />
                </Switch>
            </ShopContainer>
        );
    }
}

const mapStateToProps = ({ shop }: GlobalStateShape) => ({
    items: shop.items,
    cart: shop.cart,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<GlobalStateShape, undefined, Action>) => ({
    fetchItemsAction: () => dispatch(fetchItemsAction()),
    addItemToCart: (sku: string) => dispatch(addItemToCartAction(sku)),
});

const connectedShop = connect<ShopStateToPros, ShopDispatchToProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(Shop);

export type ShopType = new (props: ShopProps) => React.Component<ShopProps>;
export type RequiredProps = ShopOwnProps;
export default connectedShop;
