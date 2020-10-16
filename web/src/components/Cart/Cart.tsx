import { usePopper } from 'react-popper';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initCartAction, syncLocalStorage } from './actions';
import { GlobalStateShape } from 'src/types';
import { CartList } from 'src/components/Cart/CartList';

interface CartProps {
    styles: {
        [key: string]: React.CSSProperties;
    };
    attributes: {
        [key: string]: {
            [key: string]: string;
        };
    };
}

export const Cart = React.forwardRef((props: CartProps, setPopperElement: React.Dispatch<React.SetStateAction<HTMLDivElement>>) => {
    const dispatch = useDispatch();
    const cart = useSelector(({ cart }: GlobalStateShape) => cart.items);
    const visible = useSelector(({ cart }: GlobalStateShape) => cart.visible);
    const firstRun = React.useRef(true);

    React.useEffect(() => {
        dispatch(initCartAction());
        firstRun.current = false;
    }, []);

    React.useEffect(() => {
        if (!firstRun.current) {
            dispatch(syncLocalStorage());
        }
    }, [cart.length]);

    return (
        visible && <CartList ref={setPopperElement} {...props}/>
    );
});

export type CartType = typeof Cart;