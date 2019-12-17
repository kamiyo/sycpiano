import * as React from 'react';
import { AnyComponent, AsyncModule } from 'src/types';

interface AsyncComponentBase<P> {
    moduleProvider?: () => Promise<AsyncModule<P>>;
}

type AsyncComponentProps<P> = AsyncComponentBase<P> & P;

interface AsyncComponentState<P> {
    Component: AnyComponent<P>;
}

// Waits for moduleProvider to return a promise that contains the AsyncModule.
// Then sets the component of that module in the state to trigger mounting of
// component in render(). Passes through props the props.
export default class AsyncComponent<P> extends React.PureComponent<AsyncComponentProps<P>, AsyncComponentState<P>> {
    state: AsyncComponentState<P> = {
        Component: null,
    };

    constructor(props: AsyncComponentProps<P>) {
        super(props);
        this.props.moduleProvider().then((res) => {
            const Component = res.Component;
            this.setState({ Component });
        });
    }
    render() {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const { Component } = this.state as any;
        const { moduleProvider, ...props } = this.props;
        return (
            Component && <Component {...props} />
        );
    }
}
