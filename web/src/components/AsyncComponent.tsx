import React, { PureComponent } from 'react';

interface AsyncComponentProps {
    moduleProvider?: () => Promise<{ Component: new () => React.Component<any, any> }>;
    [props: string]: any;
}

interface AsyncComponentState {
    Component?: typeof React.Component;
}

export default class AsyncComponent extends PureComponent<AsyncComponentProps, AsyncComponentState> {
    state: AsyncComponentState = {
        Component: null,
    };

    async componentWillMount() {
        if (!this.state.Component) {
            const { Component } = await this.props.moduleProvider();
            this.setState({ Component });
        }
    }

    render() {
        const { Component } = this.state;
        const { moduleProvider, ...props } = this.props;
        return (
            Component && <Component {...props} />
        );
    }
}
