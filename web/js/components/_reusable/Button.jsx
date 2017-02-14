import '@/less/_reusable/button.less';

import React from 'react';

export default class Button extends React.Component {
    render() {
        var extraClasses = this.props.extraClasses;
        var extraClassesString = extraClasses ? ` ${extraClasses}` : '';
        return (
            <div className={`Button${extraClassesString}`} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        );
    }
};

Button.onClick = function(e) {};
