import { sycStoreReducer } from 'src/components/SycStore/reducers';
import SycStore from 'src/components/SycStore/SycStore';

export const Component = SycStore;
export const reducers = {
    sycStore: sycStoreReducer,
};
