import css from '@emotion/css';
import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import { initCartAction, removeItemFromCartAction, syncLocalStorage } from './actions';
import { StoreItem } from './types';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

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

interface CartStateToProps {
    readonly cartItems: string[];
    readonly storeItems: StoreItem[];
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

    componentWillReceiveProps() {
        console.log('will receive');
    }

    componentDidUpdate(prevProps: CartProps) {
        console.log(this.props);
        if (this.props.cartItems !== prevProps.cartItems) {
            this.props.syncLocalStorage();
        }
    }

    render() {
        const { cartItems, storeItems } = this.props;
        return (
            <div css={cartStyle}>
                {storeItems.length && cartItems.length
                    ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((sku) => {
                                    const { id, name, description, price } = storeItems.find((el) => el.id === sku);
                                    return (
                                        <tr key={id}>
                                            <td>{name}</td>
                                            <td>{description}</td>
                                            <td>{price}</td>
                                            <td><button onClick={() => removeItemFromCartAction(sku)}></button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : <div>{'Cart is empty.'}</div>
                }
            </div>
        );
    }
}

const mapStateToProps = (store: GlobalStateShape) => {
    console.log(store.cart.items);
    return ({
        storeItems: store.sycStore.items,
        cartItems: store.cart.items,
    });
};

export const ConnectedCart = connect<CartStateToProps, CartDispatchToProps, {}>(
    mapStateToProps,
    {
        syncLocalStorage,
        initCartAction,
        removeItemFromCartAction,
    },
)(Cart);

export type CartType = new (props: any) => React.Component<CartProps>;
export interface RequiredProps { }
