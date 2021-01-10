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
    setPopperElement: (el: HTMLDivElement) => void;
    setArrowElement: (el: HTMLDivElement) => void;
    isMobile: boolean;
}

export const Cart: React.FC<CartProps> = (props) => {
    const dispatch = useDispatch();
    const cartLength = useSelector(({ cart }: GlobalStateShape) => cart.items.length);
    const firstRun = React.useRef(true);

    React.useEffect(() => {
        console.log('initCartAction');
        dispatch(initCartAction());
        firstRun.current = false;
    }, []);

    React.useEffect(() => {
        if (!firstRun.current) {
            console.log('syncLocalStorage');
            dispatch(syncLocalStorage());
        }
    }, [cartLength]);

    return (
        <CartList {...props} />
    );
};

export type CartType = typeof Cart;