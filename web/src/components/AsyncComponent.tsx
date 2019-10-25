import * as React from 'react';
import { AnyComponent, AsyncModule } from 'src/types';

interface AsyncComponentBase {
    moduleProvider?: () => Promise<AsyncModule>;
}

type AsyncComponentProps<P> = AsyncComponentBase & P;

// Waits for moduleProvider to return a promise that contains the AsyncModule.
// Then sets the component of that module in the state to trigger mounting of
// component in render(). Passes through props the props.
const AsyncComponent: <P>(p: AsyncComponentProps<P>) => React.ReactElement<AsyncComponentProps<P>> = ({ moduleProvider, ...props}) => {
    const [Component, setComponent] = React.useState<AnyComponent | null>(null);

    React.useEffect(() => {
        const waitForModule = async () => {
            const res = await moduleProvider();
            setComponent(res.Component);
        };

        waitForModule();
    }, []);

    return (
        Component && <Component {...props} />
    );
};

export default AsyncComponent;
