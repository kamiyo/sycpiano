import React, { PureComponent } from 'react';
import { AnyComponentType, AsyncModule } from 'src/types';

interface AsyncComponentProps {
    moduleProvider?: () => Promise<AsyncModule>;
    [props: string]: any;
}

interface AsyncComponentState {
    Component?: AnyComponentType;
}

export default class AsyncComponent extends PureComponent<AsyncComponentProps, AsyncComponentState> {
    state: AsyncComponentState = {
        Component: null,
    };

    constructor(props: AsyncComponent) {
        super(props);
        this.props.moduleProvider().then(({ Component }) => {
            this.setState({ Component });
        });
    }

    render() {
        const { Component } = this.state;
        const { moduleProvider, ...props } = this.props;
        return (
            Component && <Component {...props} />
        );
    }
}
