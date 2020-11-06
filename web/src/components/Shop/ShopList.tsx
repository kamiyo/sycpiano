import { css } from '@emotion/core';
import * as React from 'react';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { ShopItem } from 'src/components/Shop/ShopItem';
import { Product } from 'src/components/Shop/types';
import { useSelector } from 'react-redux';
import { GlobalStateShape } from 'src/types';

interface ShopListProps {
    isMobile: boolean;
}

const listStyle = css({
    [screenXSorPortrait]: {
        paddingTop: navBarHeight.mobile,
    },
    overflowY: 'scroll',
    flex: '1 0 auto',
    margin: '0 auto',
    zIndex: 10,
});

const ShopList: React.FC<ShopListProps> = () => {
    const items = useSelector(({ shop }: GlobalStateShape) => shop.items);

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
