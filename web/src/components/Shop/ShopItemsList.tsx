import { css } from '@emotion/core';
import * as React from 'react';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import ConnectedShopListItem from './ShopListItem';
import { ShopItem } from './types';

interface ShopItemsListProps {
    className?: string;
    isMobile: boolean;
    items: ShopItem[];
}

const listStyle = css({
    [screenXSorPortrait]: {
        paddingTop: navBarHeight.mobile,
    },
    height: '100%',
    width: '800px',
});

const ShopItemsList: React.FC<ShopItemsListProps> = (props) => (
    <div className={props.className} css={listStyle}>
        {
            props.items.map((item: ShopItem, idx: number) => (
                <ConnectedShopListItem
                    item={item}
                    key={idx}
                />
            ))
        }
    </div>
);

export { ShopItemsList };
