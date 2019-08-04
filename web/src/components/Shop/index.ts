import { shopReducer } from 'src/components/Shop/reducers';
import SycStore from 'src/components/Shop/Shop';

export const Component = SycStore;
export const reducers = {
    shop: shopReducer,
};
