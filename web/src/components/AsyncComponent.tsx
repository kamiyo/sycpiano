import React, { PureComponent } from 'react';
import { AnyComponent, AsyncModule } from 'src/types';

interface AsyncComponentBase {
    moduleProvider?: () => Promise<AsyncModule>;
}

type AsyncComponentProps<P> = AsyncComponentBase & P;

interface AsyncComponentState {
    Component: AnyComponent;
}

export default class AsyncComponent<P> extends PureComponent<AsyncComponentProps<P>, AsyncComponentState> {
    state: AsyncComponentState = {
        Component: null,
    };

    constructor(props: AsyncComponentProps<P>) {
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
