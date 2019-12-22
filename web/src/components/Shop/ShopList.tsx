import { css } from '@emotion/core';
import * as React from 'react';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight, cartWidth } from 'src/styles/variables';
import { ShopItem } from 'src/components/Shop/ShopItem';
import { Sku } from 'src/components/Shop/types';

interface ShopListProps {
    className?: string;
    isMobile: boolean;
    items: Sku[];
}

const listStyle = css({
    [screenXSorPortrait]: {
        paddingTop: navBarHeight.mobile,
    },
    width: `calc(100vw - ${cartWidth}px)`,
    overflowY: 'scroll',
});

const ShopList: React.FC<ShopListProps> = (props) => (
    <div className={props.className} css={listStyle}>
        {
            props.items.map((item: Sku, idx: number) => (
                <ShopItem
                    item={item}
                    key={idx}
                />
            ))
        }
    </div>
);

export { ShopList };
