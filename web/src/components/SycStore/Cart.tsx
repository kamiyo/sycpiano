import css from '@emotion/css';
import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import { initCartAction, syncLocalStorage } from './actions';
import { StoreItem } from './types';

const cartStyle = css({
    maxWidth: '300px',
    width: '100%',
    position: 'fixed',
    right: 0,
    zIndex: 10,
});

interface CartStateToProps {
    readonly cartItems: string[];
    readonly storeItems: StoreItem[];
}

interface CartDispatchToProps {
    readonly initCartAction: () => void;
    readonly syncLocalStorage: () => void;
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
                <ul>
                    {storeItems.length && cartItems.length
                        ? cartItems.map((sku) => {
                            const { id, name, description } = storeItems.find((el) => el.id === sku);
                            return (
                                <li key={id}>
                                    <div>{id}</div>
                                    <div>{name}</div>
                                    <div>{description}</div>
                                </li>
                            );
                        })
                        : <li>
                            <div>{'Cart is empty.'}</div>
                        </li>
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (store: GlobalStateShape) => {
    console.log(store.cart.items);
    return ({
        storeItems: store.sycStore.items,
        cartItems: store.cart.items,
    })
};

export const ConnectedCart = connect<CartStateToProps, CartDispatchToProps, {}>(
    mapStateToProps,
    {
        syncLocalStorage,
        initCartAction,
    },
)(Cart);

export type CartType = new (props: any) => React.Component<CartProps>;
export interface RequiredProps { }
