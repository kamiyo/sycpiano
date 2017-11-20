import 'less/_reusable/button.less';

import React from 'react';
import classNames from 'classnames';

const Button = ({ children, extraClasses, onClick }) => (
    <div
        className={classNames('Button', { [extraClasses]: !!extraClasses })}
        onClick={onClick}
    >
        {children}
    </div>
);

export default Button;
