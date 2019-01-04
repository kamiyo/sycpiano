import * as React from 'react';

import styled from '@emotion/styled';

import {
    EventMonthItemBottomBorder,
    EventMonthItemMonthYear,
} from 'src/components/Schedule/EventMonthItemBody';

import { lato2 } from 'src/styles/fonts';

interface EventMonthItemProps {
    readonly style: React.CSSProperties;
    readonly month: string;
    readonly year: number;
    readonly measure: () => void;
    readonly className?: string;
}

const EventMonthItem: React.FC<EventMonthItemProps> = ({ className, style, month, year }) => (
    <div className={className} style={style}>
        <EventMonthItemMonthYear month={month} year={year} />
        <EventMonthItemBottomBorder />
    </div>
);

const StyledEventMonthItem = styled(EventMonthItem)`
    font-family: ${lato2};
    font-size: 40px;
    width: 100%;
`;

export default StyledEventMonthItem;
