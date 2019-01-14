import * as React from 'react';

import styled from '@emotion/styled';

import DiscListItem from 'src/components/About/Discs/DiscListItem';
import { Disc } from 'src/components/About/Discs/types';

import { lato2 } from 'src/styles/fonts';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

interface DiscListOwnProps {
    isMobile: boolean;
    items: Disc[];
}

type DiscListProps = DiscListOwnProps;

const DiscListUL = styled.ul`
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    list-style-type: none;
    font-family: ${lato2};

    ${screenXSorPortrait} {
        padding-top: ${navBarHeight.mobile}px;
        padding-bottom: 60px;
    }
`;

class DiscList extends React.PureComponent<DiscListProps> {
    render() {
        return (
            <div>
                <DiscListUL>
                    {
                        this.props.items.map((item, id) => (
                            <DiscListItem
                                item={item}
                                key={id}
                                currentItemId={id}
                            />
                        ))
                    }
                </DiscListUL>
            </div>
        );
    }
}

export default DiscList;
