import styled from '@emotion/styled';
import css from '@emotion/css';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import {
    checkoutAction,
    removeFromCartAction,
    setPopperElement,
    toggleCartListAction,
} from 'src/components/Cart/actions';

import TextField from '@material-ui/core/TextField';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight, cartWidth } from 'src/styles/variables';
import { lato2 } from 'src/styles/fonts';
import { magenta, lightBlue } from 'src/styles/colors';
import { mix } from 'polished';
import { formatPrice, validateEmail } from 'src/utils';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: lightBlue,
        },
        secondary: {
            main: magenta,
        }
    },
});

const cartContainerStyle = css({
    zIndex: 10,
});

const cartListStyle = css({
    backgroundColor: 'white',
    boxShadow: '0px 1px 3px 0 rgba(0, 0, 0, 0.5)',
    margin: '1.1rem',
    // position: 'fixed',
    width: cartWidth,
    // right: 0,
    // top: 0,
    // height: '100vh',
    // overflow: 'hidden',
    // paddingTop: navBarHeight.desktop,
    zIndex: 10,
    // flex: '0 1 auto',
    // [screenXSorPortrait]: {
    //     paddingTop: navBarHeight.mobile,
    // },
    fontFamily: lato2,
    fontSize: '0.8rem',
    borderRadius: 16,
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

const StyledProductTable = styled('table')({
    ['td:nth-of-type(1)']: {
        width: '30%',
    },
    ['td:nth-of-type(2)']: {
        width: '50%',
    },
    ['td:nth-of-type(3)']: {
        width: '20%',
        paddingRight: '0.5rem',
        textAlign: 'end',
    },
    // ['td:nth-of-type(4)']: {
    //     width: '20%',
    // },
    ['img']: {
        width: '100%',
    },
});

const CloseButton = styled.div({
    stroke: 'black',
    textAlign: 'center',
});

const StyledCheckoutButton = styled('input')`
    position: relative;
    font-size: 1.2em;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    padding: 10px;
    margin-bottom: 2rem;
    text-align: center;
    border-radius: 50px;
    font-family: ${lato2};
    background-color: ${magenta};
    color: #fff;
    transition: all 0.25s;
    border: none;
    display: block;

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

const StyledForm = styled.form({
    display: 'flex',
    flexDirection: 'column',
    alignItmes: 'center',
});

const StyledTextField = styled(TextField)<{}>({
    ['&&']: {
        margin: '1rem 2rem',
    },
});

interface CartListProps {
    styles: {
        [key: string]: React.CSSProperties;
    };
    attributes: {
        [key: string]: {
            [key: string]: string;
        };
    };
}

export const CartList = React.forwardRef((
    { styles, attributes }: CartListProps,
    setPopperElement: React.Dispatch<React.SetStateAction<HTMLDivElement>>,
) => {
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState(false);
    const shopItems = useSelector(({ shop }: GlobalStateShape) => shop.items);
    const cart = useSelector(({ cart }: GlobalStateShape) => cart.items);
    const checkoutError = useSelector(({ cart }: GlobalStateShape) => cart.checkoutError);
    const dispatch = useDispatch();

    let subtotal = 0;
    return (
        <div
            style={styles.popper}
            ref={setPopperElement}
            {...attributes.popper}
            css={cartContainerStyle}
        >
            {cart.length !== 0 && shopItems.length !== 0 ?
                (
                    <div css={cartListStyle}>
                        <CloseButton onClick={() => dispatch(toggleCartListAction(false))}>
                            <div style={{ width: '100%', fontSize: '2rem' }}>Cart</div>
                            {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 120 120"
                                height="50"
                                width="50"
                            >
                                <path d="M40 40L80 80M40 80L80 40" strokeLinecap="round" strokeWidth="8" />
                            </svg> */}
                        </CloseButton>
                        {checkoutError.message !== '' &&
                            (
                                <ErrorMessage>
                                    <ReactMarkdown
                                        source={checkoutError.message} />
                                </ErrorMessage>
                            )
                        }
                        <StyledProductTable>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item: string) => {
                                    const currentItem = shopItems.find(el => el.id === item);
                                    subtotal += currentItem.price;
                                    return (
                                        <tr key={item}>
                                            <td><img src={currentItem.image} /></td>
                                            <td>{currentItem.name}</td>
                                            <td>{formatPrice(currentItem.price)}</td>
                                            {/* <td>
                                                <button onClick={() => dispatch(removeFromCartAction(item))}>Remove</button>
                                            </td> */}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </StyledProductTable>
                        <div>Subtotal: {formatPrice(subtotal)}</div>
                        <StyledForm
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (error) {
                                    return;
                                }
                                if (email === '') {
                                    setError(true);
                                }
                                console.log('submitting');
                                dispatch(checkoutAction(email));
                            }}
                        >
                            <ThemeProvider theme={theme}>
                                <StyledTextField
                                label={error ? 'Invalid Email' : 'Email Address'}
                                error={error}
                                id="email-text"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setError(event.target.value !== '' && !validateEmail(event.target.value));
                                }}
                                variant="outlined"
                                margin="dense"
                                type="email"
                            />
                            <StyledCheckoutButton type="submit" value="Checkout"></StyledCheckoutButton>
                            </ThemeProvider>
                        </StyledForm>
                    </div>
                ) : (
                    <div>Cart is Empty!</div>
                )
            }
        </div>
    );

})

export type CartListType = typeof CartList;
// export interface RequiredProps {}
