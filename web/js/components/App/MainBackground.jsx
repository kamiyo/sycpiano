import '@/less/main-background.less';
import React from 'react';


export default class MainBackground extends React.Component {
    render() {
        return (
            <div className="mainBackground">
                {this.props.children}
            </div>
        )
    }
};
