import '@/less/Schedule/event-item.less';

import React from 'react';

export default class EventItem extends React.Component {
    render() {
        return (
            <div className="event-item" style={this.props.style}>
                <div className="event-item__date-container">
                    <div className="event-item__date">
                        {this.props.event.day}
                    </div>
                </div>
                <div className="event-item__info">
                    <div className="event-item__info-name">
                        {this.props.event.name}
                    </div>
                    <div className="event-item__info-time">
                        {this.props.event.time}
                    </div>
                    <div className="event-item__info-body">
                        <p className="event-item__info-program">
                            {this.props.event.program.join(', ')}
                        </p>
                        <p className="event-item__info-collaborators">
                            {this.props.event.collaborators.join(', ')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
