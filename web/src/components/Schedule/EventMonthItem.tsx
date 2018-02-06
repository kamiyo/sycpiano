import * as React from 'react';
import styled from 'react-emotion';

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

class EventMonthItem extends React.Component<EventMonthItemProps, {}> {
    componentDidMount() {
        this.props.measure();
    }

    render() {
        return (
            <div className={this.props.className} style={this.props.style}>
                <EventMonthItemMonthYear month={this.props.month} year={this.props.year} />
                <EventMonthItemBottomBorder />
            </div>
        );
    }
}

const StyledEventMonthItem = styled(EventMonthItem)`
    font-family: ${lato2};
    font-size: 40px;
    width: 100%;
`;

export default StyledEventMonthItem;
