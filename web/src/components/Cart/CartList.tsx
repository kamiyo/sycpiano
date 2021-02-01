import styled from '@emotion/styled';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import {
    checkoutAction,
    toggleCartListAction,
    checkoutErrorAction,
} from 'src/components/Cart/actions';

import TextField from '@material-ui/core/TextField';
import { ThemeProvider } from '@material-ui/core/styles';

import { cartWidth } from 'src/styles/variables';
import { lato2, lato3 } from 'src/styles/fonts';
import { theme, lightBlue, logoBlue } from 'src/styles/colors';
import { mix } from 'polished';
import { formatPrice, validateEmail } from 'src/utils';
import { CartItem } from 'src/components/Cart/CartItem';
import { Product } from 'src/components/Shop/types';
import { noHighlight } from 'src/styles/mixins';

const ARROW_SIDE = 32;

const CartListDiv = styled.div<{ isMobile: boolean }>(({ isMobile }) => ({
    backgroundColor: 'white',
    position: 'relative',
    width: isMobile ? '100vw' : cartWidth,
    margin: isMobile ? 'unset' : `${ARROW_SIDE / 2}px 1.5rem`,
    fontFamily: lato2,
    fontSize: '0.8rem',
}));

const StyledItemList = styled.div({
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 400px)',
});

const StyledHeading = styled.div({
    textAlign: 'center',
    position: 'relative',
    backgroundColor: lightBlue,
    color: 'white',
});

const CloseSVG = styled.svg({
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    stroke: 'white',
    ['&:hover']: {
        cursor: 'pointer',
    },
});

const getHoverStyle = (isMouseDown: boolean) => ({
    backgroundColor: mix(0.75, logoBlue, '#FFF'),
    color: 'white',
    cursor: 'pointer',
    border: `1px solid ${mix(0.75, logoBlue, '#FFF')}`,
    transform: isMouseDown ? 'translateY(-1.2px) scale(1.01)' : 'translateY(-2px) scale(1.04)',
    boxShadow: isMouseDown ? '0 1px 2px rgba(0, 0, 0, 0.8)' : '0 4px 6px rgba(0, 0, 0, 0.4)',
});

const StyledCheckoutButton = styled.button<{ disabled: boolean; isMouseDown: boolean }>(
    {
        position: 'relative',
        fontSize: '0.8rem',
        letterSpacing: '0.1rem',
        width: 200,
        padding: 10,
        marginBottom: '2rem',
        textAlign: 'center',
        borderRadius: 50,
        fontFamily: lato3,
        backgroundColor: lightBlue,
        color: 'white',
        transition: 'all 0.25s',
        border: `1px solid ${lightBlue}`,
        display: 'block',
        userSelect: 'none',
    },
    noHighlight,
    ({ disabled, isMouseDown }) => disabled
        ? {
            color: logoBlue,
            backgroundColor: 'white',
            border: `1px solid ${logoBlue}`,
        }
        : {
            '&:hover': getHoverStyle(isMouseDown),
        }
);

const ErrorMessage = styled.div({
    color: 'red',
    fontSize: '0.8rem',
    margin: '1rem',
});

const StyledForm = styled.form({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 2rem',
});

const StyledTextField = styled(TextField)({
    '&&': {
        margin: '2rem',
        width: '100%',
    },
});

const Subtotal = styled.div({
    backgroundColor: lightBlue,
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '1rem',
    display: 'flex',
    ['div:nth-of-type(1)']: {
        flex: '0 0 20%',
        textAlign: 'right',
    },
    ['div:nth-of-type(2)']: {
        paddingLeft: '0.5rem',
    },
});

const EmptyMessage = styled.div({
    margin: '1rem auto',
    width: 'max-content',
    fontSize: '1.2rem',
});

const StripeDiv = styled.div({
    height: '2.4rem',
    padding: '0.5rem',
    backgroundColor: lightBlue,
    direction: 'rtl',
})

const StripeIcon = styled.img({
    height: '100%',
    flex: '0 0 auto',
});

const StripeLink = styled.a({
    display: 'block',
    height: '100%',
});

interface CartListProps {
    isMobile: boolean;
}

const Heading: React.FC<Record<string, unknown>> = () => {
    const dispatch = useDispatch();

    return (
        <StyledHeading>
            <div style={{ width: '100%', fontSize: '2rem', padding: '1rem 0 0.5rem 0' }}>Cart</div>
            <CloseSVG
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 120 120"
                height="42"
                width="42"
                onClick={() => dispatch(toggleCartListAction(false))}
            >
                <path d="M40 40L80 80M40 80L80 40" strokeLinecap="square" strokeWidth="6" />
            </CloseSVG>
        </StyledHeading>
    );
};

const CheckoutForm: React.FC<{ cartLength: number }> = ({ cartLength }) => {
    const dispatch = useDispatch();
    const [isMouseDown, setIsMouseDown] = React.useState(false);
    const savedEmail = useSelector(({ cart }: GlobalStateShape) => cart.email);
    const [email, setEmail] = React.useState(savedEmail);
    const [error, setError] = React.useState(false);

    return (
        <ThemeProvider theme={theme}>
            <StyledForm
                onSubmit={(e) => {
                    e.preventDefault();
                    if (error) {
                        return;
                    }
                    else if (email === '') {
                        setError(true);
                        return;
                    }
                    console.log('submitting');
                    dispatch(checkoutAction(email));
                }}
            >
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
                <StyledCheckoutButton
                    type="submit"
                    disabled={cartLength === 0 || email === ''}
                    isMouseDown={isMouseDown}
                    onTouchStart={() => {
                        setIsMouseDown(true);
                    }}
                    onMouseDown={() => {
                        setIsMouseDown(true);
                    }}
                    onTouchEnd={() => {
                        setIsMouseDown(false);
                    }}
                    onMouseUp={() => {
                        setIsMouseDown(false);
                    }}
                >
                    Checkout
                </StyledCheckoutButton>
            </StyledForm>
        </ThemeProvider>
    );
};

export const CartList: React.FC<CartListProps> = ({
    isMobile,
}) => {
    const shopItems = useSelector(({ shop }: GlobalStateShape) => shop.items);
    const cart = useSelector(({ cart }: GlobalStateShape) => cart.items);
    const checkoutError = useSelector(({ cart }: GlobalStateShape) => cart.checkoutError);

    const dispatch = useDispatch();

    let subtotal = 0;
    const clearError = checkoutError.message !== '' && cart.every((val) => !checkoutError.data?.includes(val));
    if (clearError) {
        dispatch(checkoutErrorAction({
            message: '',
            data: [],
        }));
    }

    return (
        <CartListDiv isMobile={isMobile}>
            <Heading />
            {cart.length !== 0 && Object.keys(shopItems).length !== 0 ?
                (
                    <StyledItemList>
                        {checkoutError.message !== '' &&
                            (
                                <ErrorMessage>
                                    <ReactMarkdown
                                        source={checkoutError.message} />
                                </ErrorMessage>
                            )
                        }
                        {cart.map((item: string) => {
                            const currentItem = Object.values(shopItems)
                                .reduce((acc, prods) => acc || prods.find(el => el.id === item), undefined as Product);
                            subtotal += currentItem ? currentItem.price : 0;
                            const error = checkoutError.message !== '' && checkoutError.data.includes(item);
                            return (
                                <CartItem key={item} item={currentItem} error={!!error} />
                            );
                        })}
                    </StyledItemList>

                ) : (
                    <EmptyMessage>Cart is Empty!</EmptyMessage>
                )
            }
            <Subtotal>
                <div>Subtotal:</div>
                <div>{formatPrice(subtotal)}</div>
            </Subtotal>
            <CheckoutForm cartLength={cart.length} />
            <StripeDiv>
                <StripeLink href="https://stripe.com" target="_blank" rel="noopener, noreferrer">
                    <StripeIcon src="/static/images/logos/stripe-white.svg" />
                </StripeLink>
            </StripeDiv>
        </CartListDiv>
    );
};

export type CartListType = typeof CartList;
export type RequiredProps = CartListProps;
