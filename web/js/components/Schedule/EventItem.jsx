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
                        <ul className="event-item__info-program">
                        {
                            Object.keys(this.props.event.program).map((key) => {
                                return <li key={key}>{this.props.event.program[key]}</li>
                            })
                        }
                        </ul>
                        <ul className="event-item__info-collaborators">
                        {
                            Object.keys(this.props.event.collaborators).map((key) => {
                                return <li key={key}>{this.props.event.collaborators[key]}</li>
                            })
                        }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
