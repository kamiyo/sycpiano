import styled from '@emotion/styled';
import css from '@emotion/css';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import { checkoutAction, removeFromCartAction, toggleCartListAction, syncLocalStorage } from 'src/components/Cart/actions';

import TextField from '@material-ui/core/TextField';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight, cartWidth } from 'src/styles/variables';
import { lato2 } from 'src/styles/fonts';
import { magenta } from 'src/styles/colors';
import { mix } from 'polished';

const cartListStyle = css({
    backgroundColor: 'white',
    position: 'fixed',
    width: cartWidth,
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

export const CartList = () => {
    const [email, setEmail] = React.useState('');
    const shopItems = useSelector(({ shop }: GlobalStateShape) => shop.items);
    const cart = useSelector(({ cart }: GlobalStateShape) => cart.items);
    const errorMessage = useSelector(({ shop }: GlobalStateShape) => shop.checkOutErrorMessage);
    const dispatch = useDispatch();

    let subtotal = 0;
    return (
        <div css={cartListStyle}>
            {cart.length !== 0 && shopItems.length !== 0 ?
                (
                    <>
                        <div onClick={() => dispatch(toggleCartListAction(false))}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 120 120"
                                height="50"
                                width="50"
                            >
                                <path d="M40 40L80 80M40 80L80 40" strokeLinecap="round" strokeWidth="12" />
                            </svg>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item: string) => {
                                    const currentItem = shopItems.find(el => el.id === item);
                                    subtotal += currentItem.price;
                                    return (
                                        <tr key={item}>
                                            <td>{currentItem.id}</td>
                                            <td>{currentItem.description}</td>
                                            <td>{currentItem.price}</td>
                                            <td>
                                                <button onClick={() => dispatch(removeFromCartAction(item))}>Remove</button>
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
                                dispatch(checkoutAction(email));
                            }}
                        >
                            <TextField
                                label="Email Address"
                                id="email-text"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            {errorMessage !== '' && (
                                <ErrorMessage>
                                    <ReactMarkdown
                                        source={errorMessage} />
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

export type CartListType = typeof CartList;
// export interface RequiredProps {}
