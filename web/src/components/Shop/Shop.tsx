import styled from '@emotion/styled';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { fetchItemsAction } from 'src/components/Shop/actions'
import { ShopList } from 'src/components/Shop/ShopList';

import { container } from 'src/styles/mixins';
import { TransitionGroup, Transition } from 'react-transition-group';
import { RouteComponentProps, Route, Switch } from 'react-router-dom';
import { fadeOnEnter, fadeOnExit } from 'src/utils';
import { CheckoutSuccess } from 'src/components/Shop/CheckoutSuccess';

const ShopContainer = styled.div(
    container,
    {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    }
);

const FadingContainer = styled.div({
    height: '100%',
    width: '100%',
    visibility: 'hidden',
    position: 'absolute',
});

interface ShopProps { isMobile: boolean }

const Shop: React.FC<ShopProps & RouteComponentProps<{}>> = ({ isMobile, location }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchItemsAction());
    }, []);

    return (
        <ShopContainer>
            <TransitionGroup component={null}>
                <Transition
                    key={location.pathname.includes('checkout/success') ? 'checkoutSuccess' : 'shop'}
                    onEntering={fadeOnEnter(0.25)}
                    onExiting={fadeOnExit()}
                    timeout={750}
                    appear={true}
                >
                    <FadingContainer>
                        <Switch location={location}>
                            <Route
                                path="/shop/checkout/success"
                                render={(childProps) => (
                                    <CheckoutSuccess {...childProps} isMobile={isMobile} />
                                )}
                            />
                            <Route
                                path="/shop"
                                render={(childProps) => (
                                    <ShopList {...childProps} isMobile={isMobile} />
                                )}
                            />
                        </Switch>
                    </FadingContainer>
                </Transition>
            </TransitionGroup>
        </ShopContainer>
    );
}

export type ShopType = typeof Shop;
export type RequiredProps = ShopProps;
export default Shop;
