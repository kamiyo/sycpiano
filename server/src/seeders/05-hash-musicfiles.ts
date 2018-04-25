import * as Promise from 'bluebird';
import { createHash } from 'crypto';
import { ModelMap, MusicModel } from 'types';

const getLastName = (name: string) => {
    return /([^\s]+)\s?(?:\(.*\))?$/.exec(name)[1];
};

const normalizeString = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f":()',\.-]/g, '').replace(/\s+/g, '-').replace(/_$/, '');
};

export const up = async (models: ModelMap) => {
    const model: MusicModel = models.music;
    const musics = await model.findAll();
    Promise.each(musics, async (music) => {
        const {
            composer,
            piece,
        } = music;
        const musicFiles = await music.getMusicFiles();
        await Promise.each(musicFiles, async (musicFile) => {
            const str = `/${getLastName(composer)}/${normalizeString(piece)}${musicFile.name ? '/' + normalizeString(musicFile.name) : ''}`;
            const hash = createHash('sha1').update(str).digest('base64');
            musicFile.update({ hash });
        });
    });
};

/* tslint:disable-next-line:no-empty */
export const down = () => {};
