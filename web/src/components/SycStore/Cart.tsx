import css from '@emotion/css';
import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import { initCartAction, removeItemFromCartAction, syncLocalStorage } from './actions';
import { StoreItem, Order } from './types';

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
    readonly order: Order;
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
        if (this.props.order !== prevProps.order) {
            this.props.syncLocalStorage();
        }
    }

    render() {
        const { order } = this.props;
        let subtotal = 0;
        return (
            <div css={cartStyle}>
                {order.items.length
                    ? (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.filter((orderItem) => orderItem.type === 'sku').map((orderItem) => {
                                        const { description, parent: id, amount: price } = orderItem;
                                        subtotal += price;
                                        return (
                                            <tr key={id}>
                                                <td>{name}</td>
                                                <td>{description}</td>
                                                <td>{`$${(price / 100).toFixed(2)}`}</td>
                                                <td><button onClick={() => { }}>Remove</button></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div>{`$${(subtotal / 100).toFixed(2)}`}</div>
                        </>
                    ) : <div>{'Cart is empty.'}</div>
                }
            </div>
        );
    }
}

const mapStateToProps = (store: GlobalStateShape) => {
    console.log(store.cart.order);
    return ({
        storeItems: store.sycStore.items,
        order: store.cart.order,
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
