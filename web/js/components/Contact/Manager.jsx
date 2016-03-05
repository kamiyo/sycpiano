//import '@/less/manager.less';
import React from 'react';

export default class Manager extends React.Component {
    render() {
        return (
            <div className='managerContainer'>
                <ul>
                    <li>
                        <img src={this.props.thumbUrl} />
                        <div className='managerName'>{this.props.name}</div>
                    </li>
                    <li>
                        {this.props.title}
                    </li>
                    <li>
                        {this.props.organization}
                    </li>
                    <li>
                        {this.props.phone}
                    </li>
                    <li>
                        <a href={`mailto:${this.props.email}`}>{this.props.email}</a>
                    </li>
                </ul>
            </div>
        )
    }
};