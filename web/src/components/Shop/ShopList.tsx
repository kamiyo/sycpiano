import { css } from '@emotion/core';
import * as React from 'react';

import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';
import { ShopItem } from 'src/components/Shop/ShopItem';
import { Product } from 'src/components/Shop/types';
import { useSelector } from 'react-redux';
import { GlobalStateShape } from 'src/types';
import { pushed } from 'src/styles/mixins';
import { RouteComponentProps } from 'react-router-dom';

type ShopListProps = {
    isMobile: boolean;
} & RouteComponentProps<{ product?: string }>

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

const ShopList: React.FC<ShopListProps> = ({ match: { params: { product }} }) => {
    const items = useSelector(({ shop }: GlobalStateShape) => shop.items);
    // console.log(items);
    React.useLayoutEffect(() => {
        if (items.length && product) {
            document.getElementById(product)?.scrollIntoView();
        }
    }, [items, product])

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
