import { css } from '@emotion/core';
import * as React from 'react';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import ConnectedStoreListItem from './StoreListItem';
import { StoreItem } from './types';

interface StoreItemsListProps {
    className?: string;
    isMobile: boolean;
    items: StoreItem[];
    addItemToCart: (sku: string) => void;
}

const listStyle = css({
    [screenXSorPortrait]: {
        paddingTop: navBarHeight.mobile,
    },
    height: '100%',
    width: '800px',
});

const StoreItemsList: React.FC<StoreItemsListProps> = (props) => (
    <div className={props.className} css={listStyle}>
        {
            props.items.map((item: StoreItem, idx: number) => (
                <ConnectedStoreListItem
                    item={item}
                    key={idx}
                    addItemToCart={props.addItemToCart}
                />
            ))
        }
    </div>
);

export { StoreItemsList };
