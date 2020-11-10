import * as React from 'react';
import { Product } from 'src/components/Shop/types';
import styled from '@emotion/styled'
import { formatPrice } from 'src/utils';
import { useDispatch } from 'react-redux';
import { removeFromCartAction } from 'src/components/Cart/actions';
import { staticImage } from 'src/styles/imageUrls';

const ItemContainer = styled.div({
    display: 'flex',
    margin: '2rem 1rem',
});

const ItemThumbnail = styled.div({
    flex: '0 0 20%',
    display: 'flex',
    ['img']: {
        width: '100%',
        objectFit: 'cover',
        flex: '1',
        overflow: 'hidden',
        objectPosition: 'center',
    },
});

const ItemDescription = styled.div({
    padding: '0 0 0.5rem 0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: '0 0 80%',
});

const ItemName = styled.div<{ error: boolean }>({
    flex: '0 1 auto',
    fontSize: '1rem',
    fontWeight: 'bold',
    ['&:hover']: {
        cursor: 'pointer',
        textDecoration: 'underline',
    },
}, ({ error }) => error && ({
    color: 'red',
}));

const ItemPrice = styled.div({
    display: 'inline',
});

// const Divider = styled.span({
//     margin: '2rem',
// });

interface CartProps {
    item: Product;
    error: boolean;
}

export const CartItem: React.FC<CartProps> = ({ item, error }) => {
    const dispatch = useDispatch();

    return (
        <ItemContainer>
                <ItemThumbnail>
                    <img src={staticImage('/products/thumbnails/' + item.images[0])} />
                </ItemThumbnail>
                <ItemDescription>
                    <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                        <ItemName error={error}>{item.name}</ItemName>
                        <a style={{ flex: '0 0 auto' }} role="button" tabIndex={0} onClick={() => dispatch(removeFromCartAction(item.id))}>Remove</a>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                        <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                        {/* <Divider>|</Divider> */}
                    </div>
                </ItemDescription>
        </ItemContainer>
    );
};
