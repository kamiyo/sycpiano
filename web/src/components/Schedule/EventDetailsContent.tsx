import 'less/Schedule/event-details-content-row.less';

import classNames from 'classnames';
import React from 'react';

interface EventDetailsContentRowProps {
    icon: JSX.Element;
    content: JSX.Element;
    className?: string;
}

export const EventDetailsItem: React.SFC<EventDetailsContentRowProps> = (props) => {
    const { icon, content, className } = props;
    return (
        <div className={classNames(className, 'eventDetailsContentRow')}>
            <div className="eventDetailsContentRow__left">
                {icon}
            </div>
            <div className="eventDetailsContentRow__right">
                {
                    React.cloneElement(content, {
                        ...content.props,
                        className: classNames(content.props.className, 'content'),
                    })
                }
            </div>
        </div>
    );
};
