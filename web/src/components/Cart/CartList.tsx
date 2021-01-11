import styled from '@emotion/styled';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector, useDispatch } from 'react-redux';
import { Transition } from 'react-transition-group';
import { GlobalStateShape } from 'src/types';
import {
    checkoutAction,
    toggleCartListAction,
    checkoutErrorAction,
} from 'src/components/Cart/actions';

import TextField from '@material-ui/core/TextField';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { gsap } from 'gsap';


import { cartWidth, navBarHeight } from 'src/styles/variables';
import { lato2 } from 'src/styles/fonts';
import { magenta, lightBlue, logoBlue } from 'src/styles/colors';
import { mix } from 'polished';
import { formatPrice, validateEmail } from 'src/utils';
import { CartItem } from 'src/components/Cart/CartItem';
import { LoadingInstance } from 'src/components/LoadingSVG';
import { Product } from 'src/components/Shop/types';

const ARROW_SIDE = 32;

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

const CartContainer = styled.div<{ isMobile: boolean }>({
    zIndex: 5001,
    filter: `drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.5))`,
    overflow: 'hidden',
    height: 0,
}, ({ isMobile }) => isMobile && ({
    position: 'absolute',
    top: navBarHeight.mobile,
    zIndex: 4999,
    maxHeight: `calc(100% - ${navBarHeight.mobile}px)`,
}));

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

const Heading = styled.div({
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

const StyledCheckoutButton = styled.input<{ disabled: boolean }>({
    position: 'relative',
    fontSize: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 200,
    padding: 10,
    marginBottom: '2rem',
    textAlign: 'center',
    borderRadius: 50,
    fontFamily: lato2,
    backgroundColor: lightBlue,
    color: 'white',
    transition: 'all 0.25s',
    border: 'none',
    display: 'block',
}, ({ disabled }) => disabled
    ? {
        backgroundColor: mix(0.50, logoBlue, '#FFF'),
        border: `1px solid ${mix(0.52, logoBlue, '#FFF')}`
    }
    : {
        ['&:hover']: {
            backgroundColor: mix(0.75, lightBlue, '#fff'),
            cursor: 'pointer',
        }
    });

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

const StyledTextField = styled(TextField)({
    ['&&']: {
        margin: '2rem',
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

const Arrow = styled.div<{ transform: string }>({
    top: -15,
    width: 0,
    height: 0,
    borderLeft: '24px solid transparent',
    borderRight: '24px solid transparent',
    borderBottom: `24px solid ${lightBlue}`,
    zIndex: 10,
}, ({ transform }) => ({
    transform,
}));

const LoadingDiv = styled.div({
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    fill: 'white',
});

const CartFilterGroup = styled.div<{ isCheckingOut: boolean }>({
    position: 'relative',
}, ({ isCheckingOut }) =>
    isCheckingOut && ({
        filter: 'brightness(0.75)',
    })
);

const EmptyMessage = styled.div({
    margin: '1rem auto',
    width: 'max-content',
    fontSize: '1.2rem',
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
    setPopperElement: (el: HTMLDivElement) => void;
    setArrowElement: (el: HTMLDivElement) => void;
    isMobile: boolean;
}

export const CartList: React.FC<CartListProps> = ({
    styles,
    attributes,
    setPopperElement,
    setArrowElement,
    isMobile,
}) => {
    const visible = useSelector(({ cart }: GlobalStateShape) => cart.visible);
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState(false);
    const shopItems = useSelector(({ shop }: GlobalStateShape) => shop.items);
    const cart = useSelector(({ cart }: GlobalStateShape) => cart.items);
    const isCheckingOut = useSelector(({ cart }: GlobalStateShape) => cart.isCheckingOut);
    const checkoutError = useSelector(({ cart }: GlobalStateShape) => cart.checkoutError);
    const tl = React.useRef<gsap.core.Timeline>(null);

    const dispatch = useDispatch();

    let subtotal = 0;
    const { transform: arrowTransform = '', ...arrowStyles } = styles.arrow ?? {};
    const clearError = checkoutError.message !== '' && cart.every((val) => !checkoutError.data?.includes(val));
    if (clearError) {
        dispatch(checkoutErrorAction({
            message: '',
            data: [],
        }));
    }
    const popperStyles = isMobile ? {} : {style: styles.popper};
    const popperAttributes = isMobile ? {} : attributes.popper;
    return (
        <Transition<undefined>
            in={visible}
            timeout={250}
            onEnter={(el: HTMLDivElement) => {
                if (!tl.current) {
                    tl.current = gsap.timeline({ reversed: true, paused: true })
                        .to(el, { height: 'auto', duration: 0.25, ease: 'expo.inOut' });
                }
                tl.current.pause().play();
            }}
            onExit={() => {
                tl.current.pause().reverse();
            }}
        >
            <CartContainer
                {...popperStyles}
                isMobile={isMobile}
                ref={isMobile ? () => { } : setPopperElement}    /* eslint-disable-line @typescript-eslint/no-empty-function */
                {...popperAttributes}
            >
                {isCheckingOut &&
                    <LoadingDiv>
                        <LoadingInstance width={60} height={60} />
                    </LoadingDiv>
                }
                <CartFilterGroup isCheckingOut={isCheckingOut}>
                    {!isMobile && (
                        < Arrow
                            ref={isMobile ? () => { } : setArrowElement}     /* eslint-disable-line @typescript-eslint/no-empty-function */
                            style={arrowStyles}
                            transform={arrowTransform}
                        />
                    )}
                    <CartListDiv isMobile={isMobile}>
                        <Heading>
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
                        </Heading>
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
                                    value="Checkout with Stripe"
                                    disabled={cart.length === 0 || email === ''}
                                />
                            </StyledForm>
                        </ThemeProvider>
                    </CartListDiv>
                </CartFilterGroup>
            </CartContainer>
        </Transition>
    );

};

export type CartListType = typeof CartList;
export type RequiredProps = CartListProps;
