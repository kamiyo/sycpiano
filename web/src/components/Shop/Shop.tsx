import styled from '@emotion/styled';
import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { fetchItemsAction, addToCartAction } from 'src/components/Shop/actions';
import CartButton from 'src/components/Shop/CartButton';
import { ShopList } from 'src/components/Shop/ShopList';
import { Sku } from 'src/components/Shop/types';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';
import { ConnectedCart } from 'src/components/Shop/Cart';

const ShopContainer = styled.div`
    ${pushed}
    // background-color: #ebebeb;
    display: flex;
`;

const StyledShopList = styled(ShopList)`
    margin: 0 auto;
    padding: 2rem;
    z-index: 10;
`;

interface ShopStateToProps {
    readonly items: Sku[];
}

interface ShopDispatchToProps {
    readonly fetchItemsAction: () => Promise<void>;
}

interface ShopOwnProps { isMobile: boolean }

type ShopProps = ShopOwnProps & ShopStateToProps & ShopDispatchToProps;

class Shop extends React.PureComponent<ShopProps, {}> {
    componentDidMount() {
        this.props.fetchItemsAction();
    }

    render() {
        return (
            <ShopContainer>
                <StyledShopList
                    isMobile={this.props.isMobile}
                    items={this.props.items}
                />
                <ConnectedCart />
                <CartButton
                    onClick={() => {}}
                />
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
    addToCart: (sku: string) => dispatch(addToCartAction(sku)),
});

const connectedShop = connect<ShopStateToProps, ShopDispatchToProps, ShopOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(Shop);

export type ShopType = typeof connectedShop;
export type RequiredProps = ShopOwnProps;
export default connectedShop;
