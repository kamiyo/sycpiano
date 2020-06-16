import css from '@emotion/css';
import styled from '@emotion/styled';
import * as React from 'react';

import { addToCartAction, removeFromCartAction } from 'src/components/Shop/actions';
import { ShoppingCart, Sku } from 'src/components/Shop/types';

import { lato3, lato2 } from 'src/styles/fonts';
import { logoBlue } from 'src/styles/colors';
import { mix } from 'polished';
import { connect } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import toUpper from 'lodash-es/toUpper';

interface ShopItemStateToProps {
    readonly cart: ShoppingCart;
}

interface ShopItemDispatchToProps {
    readonly addToCartAction: typeof addToCartAction;
    readonly removeFromCartAction: typeof removeFromCartAction;
}

interface ShopItemOwnProps {
    item: Sku;
    key: string | number;
    className?: string;
}

type ShopItemProps = ShopItemStateToProps & ShopItemDispatchToProps & ShopItemOwnProps;

const Thumbnail = styled('div')<{ imageUrl: string }>(
    {
        flex: '0 0 200px',
        backgroundColor: '#fff',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        position: 'relative',
        boxShadow: '0 2px 7px -4px rgba(0,0,0,0.8)',
        '&:before, &:after': {
            zIndex: -1,
            position: 'absolute',
            content: '""',
            bottom: '16px',
            left: '0.35rem',
            width: '50%',
            top: '85%',
            maxWidth: '48%',
            background: 'rgba(0,0,0,0.7)',
            boxShadow: '0 1.0rem 0.75rem -2px rgba(0, 0, 0, 0.7)',
            transform: 'rotate(-3deg)'
        },
        '&:after': {
            transform: 'rotate(3deg)',
            right: '0.35rem',
            left: 'unset',
        },
    },
    props => ({
        backgroundImage: `url(${props.imageUrl})`
    }),
);

const contentContainerStyle = css({
    flex: '1 1 auto',
    height: 'auto',
    padding: '1rem 1rem 1rem 4rem',
    backgroundColor: 'transparent',
    letterSpacing: '0.01rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
});

const buttonBoxShadow = `
    0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12)
`;

const CartButton = styled.button<{ isItemInCart: boolean }>(
    {
        fontSize: '0.8em',
        width: '230px',
        padding: '10px',
        textAlign: 'center',
        fontFamily: lato3,
        borderRadius: '20px',
        transition: 'all 0.25s',
        // boxShadow: buttonBoxShadow,
        letterSpacing: '0.1rem',
        '&:hover': {
            backgroundColor: mix(0.75, logoBlue, '#FFF'),
            color: 'white',
            cursor: 'pointer',
        },
    },
    props => {
        if (props.isItemInCart) {
            return {
                color: 'white',
                backgroundColor: mix(0.50, logoBlue, '#FFF'),
                border: `1px solid ${mix(0.52, logoBlue, '#FFF')}`
            }
        } else {
            return {
                color: logoBlue,
                backgroundColor: 'white',
                border: `1px solid ${logoBlue}`,
            }
        }
    },
);

const boxShadow = `
    0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 2px 1px -1px rgba(0, 0, 0, 0.12)
`;

const ShopItemContainer = styled.div`
    font-family: ${lato2};
    height: auto;
    display: flex;
    // box-shadow: ${boxShadow};
    border-radius: 4px;
    margin: 5rem auto;
    flex: 0 1 600px;
    max-width: 600px;
`;

const ItemName = styled.div({
    margin: '0 0 0.8rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold'
});

const ItemDescription = styled.div({
    margin: '2rem 0',
    paddingLeft: '1rem',
});

const ItemDetails = styled.span({
    margin: '0.2rem 0',
});

const ItemPrice = styled.span({
    margin: '0.2rem 0',
    fontWeight: 'bold',
});

const DetailContainer = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 500,
});

const Separator = styled.span({
    margin: '0.2rem 1rem',
    fontSize: '1.5rem',
});

const formatCentsToDollars = (price: number) => `$${(price / 100).toFixed(2)}`;

const ShopItemWithoutConnect: React.FC<ShopItemProps> = ({ item, className, ...props }) => {
    const addToCart = props.addToCartAction;
    const removeFromCart = props.removeFromCartAction;
    const isItemInCart = props.cart.items.includes(item.id)
    return (
        <ShopItemContainer className={className}>
            <Thumbnail imageUrl={item.image} />
            <div css={contentContainerStyle}>
                <div css={{ marginBottom: '24px' }}>
                    <ItemName>{item.caption}</ItemName>
                    <ItemDescription>{item.description}</ItemDescription>
                    <DetailContainer>
                        <ItemDetails>{toUpper(item.format)} format</ItemDetails>
                        <Separator>|</Separator>
                        <ItemDetails>{item.pages} pages</ItemDetails>
                        <Separator>|</Separator>
                        <ItemPrice>{formatCentsToDollars(item.price)}</ItemPrice>
                    </DetailContainer>
                </div>
                <CartButton
                    isItemInCart={isItemInCart}
                    onClick={() => isItemInCart ? removeFromCart(item.id) : addToCart(item.id)}
                >
                    {isItemInCart ? 'Remove from Cart' : 'Add to Cart'}
                </CartButton>
            </div>
        </ShopItemContainer>
    )
};

const mapStateToProps = ({ shop }: GlobalStateShape) => ({ cart: shop.cart });

const ShopItem = connect<ShopItemStateToProps, ShopItemDispatchToProps, ShopItemOwnProps>(
    mapStateToProps,
    { addToCartAction, removeFromCartAction },
)(ShopItemWithoutConnect)

export { ShopItem };
