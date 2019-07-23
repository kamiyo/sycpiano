import css from '@emotion/css';
import styled from '@emotion/styled';
import * as React from 'react';
import { StoreItem } from 'src/components/SycStore/types';

import { lato3 } from 'src/styles/fonts';

interface StoreListItemProps {
    item: StoreItem;
    key: string | number;
    className?: string;
    addItemToCart: (sku: string) => void;
}

const thumbnailStyle = css({
    flex: '0 1 300px',
    height: '100%',
    backgroundColor: 'white',
    padding: '10px',
});

const contentStyle = css({
    flex: '1 1 auto',
    height: '100%',
    padding: '16px',
    backgroundColor: 'white',
});

let StoreListItem: React.FC<StoreListItemProps> = ({ item, className, addItemToCart }) => (
    <div className={className}>
        {
            item.image &&
            <img
                css={thumbnailStyle}
                src={item.image}
            />
        }
        <div css={contentStyle}>
            <h2>{item.name}</h2>
            <span>{item.caption}</span>
            <button onClick={() => addItemToCart(item.id)}>{'Add to Cart'}</button>
        </div>
    </div>
);

const boxShadow = `
    0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 2px 1px -1px rgba(0, 0, 0, 0.12)
`;

StoreListItem = styled(StoreListItem)`
    font-family: ${lato3};
    height: 250px;
    display: flex;
    box-shadow: ${boxShadow};
    border-radius: 4px;
    margin-top: 15px;
    overflow: hidden;
`;

export { StoreListItem };
