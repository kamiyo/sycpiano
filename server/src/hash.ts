import { createHash } from 'crypto';

const getLastName = (name: string) => {
    return /([^\s]+)\s?(?:\(.*\))?$/.exec(name)[1];
};

// We don't care about accents and diacratics when doing the hash.
const normalizeString = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f":()',\.-]/g, '').replace(/\s+/g, '-').replace(/_$/, '');
};

// Creates a hash fom the music details to store in DB for fast retrieval.
export const getHash = (composer: string, piece: string, name?: string) => {
    const str = `/${getLastName(composer)}/${normalizeString(piece)}${name ? '/' + normalizeString(name) : ''}`;
    const hash = createHash('sha1').update(str).digest('base64');
    return hash;
};
