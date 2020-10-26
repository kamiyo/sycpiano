import * as React from 'react';
import { Sku } from 'src/components/Shop/types';
import styled from '@emotion/styled'
import { formatPrice } from 'src/utils';
import { useDispatch } from 'react-redux';
import { removeFromCartAction } from 'src/components/Cart/actions';

const ItemContainer = styled.div({
    display: 'flex',
    margin: '2rem 1rem',
});

const ItemThumbnail = styled.div({
    flex: '0 0 20%',
    ['img']: {
        height: '100%',
        maxWidth: '100%',
    },
});

const ItemDescription = styled.div({
    padding: '0 0 0.5rem 0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: '1 0 auto',
});

const ItemName = styled.div<{ error: boolean }>({
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

const Divider = styled.span({
    margin: '2rem',
});

interface CartProps {
    item: Sku;
    error: boolean;
}

export const CartItem: React.FC<CartProps> = ({ item, error }) => {
    const dispatch = useDispatch();

    return (
        <ItemContainer>
                <ItemThumbnail>
                    <img src={item.image} />
                </ItemThumbnail>
                <ItemDescription>
                    <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                        <ItemName error={error}>{item.name}</ItemName>
                        <a role="button" tabIndex={0} onClick={() => dispatch(removeFromCartAction(item.id))}>Remove</a>
                    </div>
                    <div>
                        <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                        {/* <Divider>|</Divider> */}
                    </div>
                </ItemDescription>
        </ItemContainer>
    )
                                            {/* <td>
                                                <button onClick={() => dispatch(removeFromCartAction(item))}>Remove</button>
                                            </td> */}
};
