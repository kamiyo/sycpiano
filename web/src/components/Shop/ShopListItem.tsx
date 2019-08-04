import css from '@emotion/css';
import styled from '@emotion/styled';
import mix from 'polished/lib/color/mix';
import * as React from 'react';
import { connect } from 'react-redux';
import { ShoppingCart, ShopItem } from 'src/components/Shop/types';
import { GlobalStateShape } from 'src/types';

import { magenta } from 'src/styles/colors';
import { lato2, lato3 } from 'src/styles/fonts';
import { addToCartAction, removeFromCartAction } from './actions';

interface ShopItemStateToProps {
    readonly cart: ShoppingCart;
}

interface ShopItemDispatchToProps {
    readonly addToCartAction: typeof addToCartAction;
    readonly removeFromCartAction: typeof removeFromCartAction;
}

interface ShopItemOwnProps {
    item: ShopItem;
    key: string | number;
    className?: string;
}

type ShopItemProps = ShopItemOwnProps & ShopItemStateToProps & ShopItemDispatchToProps;

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
    font-size: 1.2em;
    width: 230px;
    padding: 10px;
    text-align: center;
    border-radius: 4px;
    font-family: ${lato2};
    background-color: ${magenta};
    color: #fff;
    transition: all 0.25s;
    box-shadow: ${buttonBoxShadow};

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
    font-family: ${lato3};
    height: 250px;
    display: flex;
    box-shadow: ${boxShadow};
    border-radius: 4px;
    margin-top: 15px;
    overflow: hidden;
`;

const ShopItem: React.FC<ShopItemProps> = (props) => {
    const { className, item } = props;
    const addToCart = props.addToCartAction;
    const removeFromCart = props.removeFromCartAction;
    const isItemInCart = props.cart.items.has(item.skuId);

    return (
        <ShopItemContainer className={className}>
            {
                item.images.length &&
                    <div css={thumbnailStyle(item.images[0])} />
            }
            <div css={contentContainerStyle}>
                <div css={{ marginBottom: '16px' }}>
                    <h2 css={{ margin: '0 0 10px 0' }}>{item.name}</h2>
                    <span>{item.caption}</span>
                </div>
                <button
                    css={addToCartButtonStyle}
                    onClick={() => isItemInCart ? removeFromCart(item.skuId) : addToCart(item.skuId)}
                >
                    {isItemInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
            </div>
        </ShopItemContainer>
    );
};

const mapStateToProps = ({ sycStore }: GlobalStateShape) => ({ cart: sycStore.cart });

const connectedShopItem = connect<ShopItemStateToProps, ShopItemDispatchToProps, {}>(
    mapStateToProps,
    { addToCartAction, removeFromCartAction },
)(ShopItem);

export default connectedShopItem;
