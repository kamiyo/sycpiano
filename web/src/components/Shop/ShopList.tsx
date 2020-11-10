import { css } from '@emotion/core';
import * as React from 'react';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { ShopItem } from 'src/components/Shop/ShopItem';
import { Product } from 'src/components/Shop/types';
import { useSelector } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import { pushed } from 'src/styles/mixins';

interface ShopListProps {
    isMobile: boolean;
}

const listStyle = css(
    pushed,
    {
        [screenXSorPortrait]: {
            paddingTop: navBarHeight.mobile,
        },
        overflowY: 'scroll',
        flex: '1 0 auto',
        zIndex: 10,
    }
);

const ShopList: React.FC<ShopListProps> = () => {
    const items = useSelector(({ shop }: GlobalStateShape) => shop.items);
    console.log(items);

    return (
        <div css={listStyle}>
            {
                items.map((item: Product, idx: number) => (
                    <ShopItem
                        item={item}
                        key={idx}
                    />
                ))
            }
        </div>
    )
};

export { ShopList };
