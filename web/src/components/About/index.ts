import About from 'src/components/About/About';
import * as about from 'src/components/About/reducers';

export const Component = About;
export const reducers = {
    about: about.aboutReducer,
};
