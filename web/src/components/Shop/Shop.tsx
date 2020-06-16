import styled from '@emotion/styled';
import * as React from 'react';
import { connect } from 'react-redux';
import { Transition } from 'react-transition-group';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { gsap } from 'gsap';

import { fetchItemsAction, addToCartAction } from 'src/components/Shop/actions';
import CartButton from 'src/components/Shop/CartButton';
import { ShopList } from 'src/components/Shop/ShopList';
import { Sku } from 'src/components/Shop/types';
import { GlobalStateShape } from 'src/types';

import { pushed } from 'src/styles/mixins';
import { ConnectedCart } from 'src/components/Shop/Cart';
import { cartWidth } from 'src/styles/variables';

const ShopContainer = styled.div`
    ${pushed}
    // background-color: #ebebeb;
    display: flex;
`;

const StyledShopList = styled(ShopList)`
    margin: 0 auto;
    // padding: 0 2rem;
    z-index: 10;
`;

interface ShopStateToProps {
    readonly items: Sku[];
}

interface ShopDispatchToProps {
    readonly fetchItemsAction: () => Promise<void>;
}

interface ShopState {
    cartOpen: boolean;
}

interface ShopOwnProps { isMobile: boolean }

type ShopProps = ShopOwnProps & ShopStateToProps & ShopDispatchToProps;

const onEnterAnimation = (el: HTMLElement) => {
    gsap.to(el, 0.25, { width: cartWidth });
};

const onExitAnimation = (el: HTMLElement) => {
    gsap.to(el, 0.25, { width: 0 });
}

class Shop extends React.PureComponent<ShopProps, ShopState> {
    state: ShopState = {
        cartOpen: false,
    };

    componentDidMount() {
        this.props.fetchItemsAction();
    }

    toggleCart = () => {
        this.setState({ cartOpen: !this.state.cartOpen });
    }

    render() {
        return (
            <ShopContainer>
                <StyledShopList
                    isMobile={this.props.isMobile}
                    items={this.props.items}
                />
                <Transition
                    in={this.state.cartOpen}
                    onEnter={onEnterAnimation}
                    onExit={onExitAnimation}
                    timeout={250}
                >
                    <ConnectedCart />
                </Transition>
                <CartButton
                    onClick={() => { this.toggleCart(); }}
                    cartOpen={this.state.cartOpen}
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
