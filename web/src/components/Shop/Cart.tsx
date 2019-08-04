import css from '@emotion/css';
import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import { initCartAction, removeItemFromCartAction, syncLocalStorage } from './actions';
import { ShopItem } from './types';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { OrderedSet } from 'immutable';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from '@emotion/styled-base';
import { lato2 } from 'src/styles/fonts';
import { magenta } from 'src/styles/colors';
import { mix } from 'polished';

const cartStyle = css({
    backgroundColor: 'white',
    width: '300px',
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100vh',
    paddingTop: navBarHeight.desktop,
    zIndex: 10,
    [screenXSorPortrait]: {
        paddingTop: navBarHeight.mobile,
    },
});

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

interface CartStateToProps {
    readonly storeItems: ShopItem[];
    readonly cart: OrderedSet<string>;
}

interface CartDispatchToProps {
    readonly initCartAction: () => void;
    readonly syncLocalStorage: () => void;
    readonly removeItemFromCartAction: (sku: string) => void;
}

type CartProps = CartStateToProps & CartDispatchToProps;

class Cart extends React.Component<CartProps, {}> {
    componentDidMount() {
        this.props.initCartAction();
    }

    componentDidUpdate(prevProps: CartProps) {
        if (prevProps.cart !== this.props.cart) {
            this.props.syncLocalStorage();
        }
    }

    render() {
        let subtotal = 0;
        return (
            <div css={cartStyle}>
                {!this.props.cart.isEmpty() ?
                    (
                        <>
                        <table>
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.cart.toJS().map((item: string) => {
                                    const currentItem = this.props.storeItems.find(el => el.skuId === item);
                                    subtotal += currentItem.price;
                                    return (
                                        <tr>
                                            <td>{currentItem.skuId}</td>
                                            <td>{currentItem.description}</td>
                                            <td>{currentItem.price}</td>
                                            <td>
                                                <button onClick={() => this.props.removeItemFromCartAction(item)}>Remove</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div>Subtotal: {subtotal}</div>
                        <StyledCheckoutButton route={'/store/checkout'}>Checkout</StyledCheckoutButton>
                        </>
                    ) : (
                        <div>Cart is Empty!</div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (store: GlobalStateShape) => {
    return ({
        storeItems: store.shop.items,
        cart: store.shop.cart.items,
    });
};

export const ConnectedCart = connect<CartStateToProps, {}, {}>(
    mapStateToProps,
    {
        syncLocalStorage,
        initCartAction,
        removeItemFromCartAction,
    },
)(Cart);

export type CartType = new (props: any) => React.Component<CartProps>;
// export interface RequiredProps {}
