import * as React from 'react';

import styled from '@emotion/styled';

interface EventMonthItemBodyProps {
    readonly month: string;
    readonly year: number;
    readonly className?: string;
}

const EventMonthItemBottomBorder = styled.div`
    margin: 0 auto 1px;
    width: 80%;
    max-width: 1240px;
    display: block;
    border: none;
    height: 1px;
    background: black;
    background: radial-gradient(circle farthest-side at 0%, black, white 90%);
`;

const StyledDiv = styled.div`
    padding: 20px 0 0 28px;
    width: 80%;
    max-width: 1240px;
    margin: 0 auto;
`;

const EventMonthItemMonthYear: React.FC<EventMonthItemBodyProps> = ({ className, month, year }) => (
    <StyledDiv className={className}>{`${month} ${year}`}</StyledDiv>
);

export { EventMonthItemBottomBorder, EventMonthItemMonthYear };
