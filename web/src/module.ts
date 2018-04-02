import { registerReducer } from 'src/store';
import { AsyncModule, AsyncStore } from 'src/types';

const modules: {
    [key: string]: AsyncModule;
} = {};

const extractModule = (store: AsyncStore) => async (name: string, moduleProvider: Promise<AsyncModule>) => {
    if (modules.hasOwnProperty(name)) {
        return Promise.resolve(modules[name]);
    } else {
        const mod = await moduleProvider;
        if (mod.reducers) {
            registerReducer(store, mod.reducers);
        }
        modules[name] = mod;
        return mod;
    }
};

export default extractModule;
