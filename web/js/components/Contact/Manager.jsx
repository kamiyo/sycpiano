//import '@/less/manager.less';
import React from 'react';

export default class Manager extends React.Component {
    render() {
        return (
            <div className='managerContainer'>
                <a href={this.props.email}>this.props.email</a>

            </div>
        )
    }
}