import { registerReducer } from 'src/store';
import { AsyncModule, AsyncStore } from 'src/types';

// Cache of already loaded modules
const modules: {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    [key: string]: AsyncModule<any>;
} = {};

// This function checks if module is cached, if is, returns the cached module;
// otherwise, registers the reducer of the (new) module, and caches it.
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const extractModule = (store: AsyncStore) => async (name: string, moduleProvider: Promise<AsyncModule<any>>) => {
    if (Object.prototype.hasOwnProperty.call(modules, name)) {
        return Promise.resolve(modules[name]);
    } else {
        const mod = await moduleProvider;
        if (mod.reducers) {
            registerReducer(store, mod.reducers);
        }
        /* eslint-disable-next-line require-atomic-updates */
        modules[name] = mod;
        return mod;
    }
};

export default extractModule;
