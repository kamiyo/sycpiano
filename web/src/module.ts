import { registerReducer } from 'src/store';
import { AsyncModule, AsyncStore } from 'src/types';

// Cache of already loaded modules
const modules: {
    [key: string]: AsyncModule;
} = {};

// This function checks if module is cached, if is, returns the cached module;
// otherwise, registers the reducer of the (new) module, and caches it.
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
