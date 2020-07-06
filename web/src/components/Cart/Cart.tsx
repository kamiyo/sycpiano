import styled from '@emotion/styled';
import css from '@emotion/css';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import { checkoutAction, initCartAction, removeFromCartAction, syncLocalStorage } from 'src/components/Cart/actions';
import { Sku } from 'src/components/Shop/types';

import TextField from '@material-ui/core/TextField';

import { screenXSorPortrait} from 'src/styles/screens';
import { navBarHeight, cartWidth } from 'src/styles/variables';
import { lato2 } from 'src/styles/fonts';
import { magenta } from 'src/styles/colors';
import { mix } from 'polished';

const cartStyle = css({
    backgroundColor: 'white',
    position: 'fixed',
    // width: cartWidth,
    width: 0,
    right: 0,
    top: 0,
    height: '100vh',
    overflow: 'hidden',
    // paddingTop: navBarHeight.desktop,
    zIndex: 10,
    flex: '0 1 auto',
    [screenXSorPortrait]: {
        paddingTop: navBarHeight.mobile,
    },
});

// interface CheckoutButtonOwnProps {
//     readonly children: React.ReactNode;
//     readonly route: string;
//     readonly className?: string;
// }

// type CheckoutButtonProps = CheckoutButtonOwnProps & RouteComponentProps;

// const CheckoutButton = withRouter(
//     ({ history, children, route, className }: CheckoutButtonProps) => (
//         <button className={className} onClick={() => history.push(route)}>
//             {children}
//         </button>
//     ));

const StyledCheckoutButton = styled('input')`
    position: relative;
    font-size: 1.2em;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    padding: 10px;
    text-align: center;
    border-radius: 50px;
    font-family: ${lato2};
    background-color: ${magenta};
    color: #fff;
    transition: all 0.25s;
    border: none;

    &:hover {
        background-color: ${mix(0.75, magenta, '#FFF')};
        color: white;
        cursor: pointer;
    }
`;

const ErrorMessage = styled.div({
    color: 'red',
    fontSize: '0.8rem',
    margin: '1rem',
});

interface CartStateToProps {
    readonly shopItems: Sku[];
    readonly cart: string[];
    readonly errorMessage: string;
}

interface CartDispatchToProps {
    readonly initCartAction: () => void;
    readonly syncLocalStorage: () => void;
    readonly removeFromCartAction: (sku: string) => void;
    readonly checkoutAction: (email: string) => void;
}

type CartProps = CartStateToProps & CartDispatchToProps;

class Cart extends React.Component<CartProps, { email: string }> {
    state = { email: '' };

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
                {this.props.cart.length !== 0 && this.props.shopItems.length !== 0 ?
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
                                {this.props.cart.map((item: string) => {
                                    const currentItem = this.props.shopItems.find(el => el.id === item);
                                    subtotal += currentItem.price;
                                    return (
                                        <tr key={item}>
                                            <td>{currentItem.id}</td>
                                            <td>{currentItem.description}</td>
                                            <td>{currentItem.price}</td>
                                            <td>
                                                <button onClick={() => this.props.removeFromCartAction(item)}>Remove</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div>Subtotal: {subtotal}</div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                console.log('submitting');
                                this.props.checkoutAction(this.state.email)
                            }}
                        >
                            <TextField
                                label="Email Address"
                                id="email-text"
                                value={this.state.email}
                                onChange={(event) => this.setState({ email: event.target.value })}
                            />
                            {this.props.errorMessage !== '' && (
                                <ErrorMessage>
                                    <ReactMarkdown
                                        source={this.props.errorMessage}/>
                                </ErrorMessage>
                            )}
                            <StyledCheckoutButton type="submit" value="Checkout"></StyledCheckoutButton>
                        </form>
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
        shopItems: store.shop.items,
        cart: store.shop.cart.items,
        errorMessage: store.shop.checkOutErrorMessage,
    });
};

export const ConnectedCart = connect<CartStateToProps, CartDispatchToProps, {}>(
    mapStateToProps,
    {
        syncLocalStorage,
        initCartAction,
        removeFromCartAction,
        checkoutAction,
    },
)(Cart);

export type CartType = typeof ConnectedCart;
// export interface RequiredProps {}
