import css from '@emotion/css';
import styled from '@emotion/styled';
import * as React from 'react';

import { addToCartAction, removeFromCartAction } from 'src/components/Shop/actions';
import { ShoppingCart, Sku } from 'src/components/Shop/types';

import { lato3, lato2 } from 'src/styles/fonts';
import { magenta } from 'src/styles/colors';
import { mix } from 'polished';
import { connect } from 'react-redux';
import { GlobalStateShape } from 'src/types';

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

const thumbnailStyle = (imageUrl: string) => css({
    flex: '0 0 300px',
    height: '100%',
    backgroundColor: 'fff',
    backgroundImage: `url(${imageUrl})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    maxWidth: '300px',
});

const contentContainerStyle = css({
    flex: '1 1 auto',
    height: '100%',
    padding: '16px',
    backgroundColor: '#fff',
});

const buttonBoxShadow = `
    0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12)
`;

const addToCartButtonStyle = css`
    font-size: 0.8em;
    width: 230px;
    padding: 10px;
    text-align: center;
    font-family: ${lato3};
    border: 1px solid ${magenta};
    border-radius: 20px;
    color: ${magenta};
    transition: all 0.25s;
    box-shadow: ${buttonBoxShadow};
    background-color: white;
    letter-spacing: 0.1rem;

    &:hover {
        background-color: ${mix(0.75, magenta, '#FFF')};
        color: white;
        cursor: pointer;
    }
`;

const boxShadow = `
    0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 2px 1px -1px rgba(0, 0, 0, 0.12)
`;

const ShopItemContainer = styled.div`
    font-family: ${lato2};
    height: 250px;
    display: flex;
    box-shadow: ${boxShadow};
    border-radius: 4px;
    margin: 1rem auto;
    overflow: hidden;
    max-width: 600px;
`;

const ShopItemWithoutConnect: React.FC<ShopItemProps> = ({ item, className, ...props }) => {
    const addToCart = props.addToCartAction;
    const removeFromCart = props.removeFromCartAction;
    const isItemInCart = props.cart.items.includes(item.id)
    return (
        <ShopItemContainer className={className}>
            <div css={thumbnailStyle(item.image)} />
            <div css={contentContainerStyle}>
                <div css={{ marginBottom: '16px' }}>
                    <h2 css={{ margin: '0 0 10px 0' }}>{item.name}</h2>
                    <span>{item.caption}</span>
                </div>
                <button
                    css={addToCartButtonStyle}
                    onClick={() => isItemInCart ? removeFromCart(item.id) : addToCart(item.id)}
                >
                    {isItemInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
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
