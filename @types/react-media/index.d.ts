import * as React from 'react';

interface ReactMediaProps {
    query: string | object | object[];
    defaultMatches?: boolean = true;
    render?: () => React.ReactNode;
    children?: React.ReactNode | (() => React.ReactNode);
    targetWindow?: object;
}

declare class ReactMedia extends React.Component<ReactMediaProps> {}
export default ReactMedia;
