import 'less/_reusable/button.less';

import * as React from 'react';

interface ButtonProps {
    extraClasses: string[];
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

function mergeClasses(classes: string[]): string {
    return classes.reduce((accumulator: string, value: string): string => {
        return accumulator += `${value} `;
    }, '');
}

const Button: React.SFC<ButtonProps & React.HTMLAttributes<HTMLElement>> = ({ children, extraClasses, onClick }) => (
    <div
        className={mergeClasses(['Button', ...extraClasses])}
        onClick={onClick}
    >
        {children}
    </div>
);

export default Button;
