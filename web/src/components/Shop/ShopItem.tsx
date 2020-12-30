import css from '@emotion/css';
import styled from '@emotion/styled';
import * as React from 'react';

import { addToCartAction, removeFromCartAction } from 'src/components/Cart/actions';
import { Product } from 'src/components/Shop/types';

import { lato3, lato2 } from 'src/styles/fonts';
import { logoBlue } from 'src/styles/colors';
import { mix } from 'polished';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import toUpper from 'lodash-es/toUpper';
import { staticImage } from 'src/styles/imageUrls';

interface ShopItemProps {
    item: Product;
    key: string | number;
    className?: string;
}

const ThumbnailContainer = styled('div')(
    {
        flex: '0 0 200px',
        position: 'relative',
        boxShadow: '0 2px 7px -4px rgba(0,0,0,0.8)',
        zIndex: 0,
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
);

const Thumbnail = styled('div')<{ imageUrl: string }>(
    {
        backgroundColor: '#fff',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '100%',
    },
    props => ({
        backgroundImage: `url(${props.imageUrl})`
    })
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

// const boxShadow = `
//     0px 1px 3px 0px rgba(0, 0, 0, 0.2),
//     0px 1px 1px 0px rgba(0, 0, 0, 0.14),
//     0px 2px 1px -1px rgba(0, 0, 0, 0.12)
// `;

const getHoverStyle = (isMouseDown: boolean) => ({
    backgroundColor: mix(0.75, logoBlue, '#FFF'),
    color: 'white',
    cursor: 'pointer',
    border: `1px solid ${mix(0.75, logoBlue, '#FFF')}`,
    transform: isMouseDown ? 'translateY(-1.2px) scale(1.01)' : 'translateY(-2px) scale(1.04)',
    boxShadow: isMouseDown ? '0 1px 2px rgba(0, 0, 0, 0.8)' : '0 4px 6px rgba(0, 0, 0, 0.4)',
});

const CartButton = styled.button<{ isItemInCart: boolean; isMouseDown: boolean }>(
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
    },
    props => {
        let base;
        if (props.isItemInCart) {
            base = {
                color: 'white',
                backgroundColor: mix(0.50, logoBlue, '#FFF'),
                border: `1px solid ${mix(0.52, logoBlue, '#FFF')}`
            };
        } else {
            base = {
                color: logoBlue,
                backgroundColor: 'white',
                border: `1px solid ${logoBlue}`,
            };
        }
        return {
            ...base,
            '&:hover': getHoverStyle(props.isMouseDown),
        };
    },
);

const ShopItemContainer = styled.div`
    font-family: ${lato2};
    height: auto;
    display: flex;
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

const ShopItem: React.FC<ShopItemProps> = ({ item, className }) => {
    const isItemInCart = useSelector(({ cart }: GlobalStateShape) => cart.items.includes(item.id));
    const [isMouseDown, setIsMouseDown] = React.useState(false);

    const dispatch = useDispatch();

    return (
        <ShopItemContainer className={className}>
            <ThumbnailContainer>
                <Thumbnail imageUrl={staticImage('/products/thumbnails/' + item.images[0]) || ''}/>
            </ThumbnailContainer>
            <div id={item.permalink} css={contentContainerStyle}>
                <div css={{ marginBottom: '24px' }}>
                    <ItemName>{item.name}</ItemName>
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
                    isMouseDown={isMouseDown}
                    isItemInCart={isItemInCart}
                    onMouseDown={() => {
                        setIsMouseDown(true);
                    }}
                    onMouseUp={() => {
                        setIsMouseDown(false);
                    }}
                    onClick={() =>
                        isItemInCart ? dispatch(removeFromCartAction(item.id)) : dispatch(addToCartAction(item.id))
                    }
                >
                    {isItemInCart ? 'Remove from Cart' : 'Add to Cart'}
                </CartButton>
            </div>
        </ShopItemContainer>
    )
};

export { ShopItem };
