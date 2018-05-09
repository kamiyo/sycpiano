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
    const model: MusicModel = models.music as MusicModel;
    const musics = await model.findAll({
        attributes: ['id', 'composer', 'piece'],
    });
    await Promise.each(musics, async (music) => {
        const {
            composer,
            piece,
        } = music;
        const musicFiles = await music.getMusicFiles({ attributes: ['id', 'name'] });
        await Promise.each(musicFiles, async (musicFile) => {
            const str = `/${getLastName(composer)}/${normalizeString(piece)}${musicFile.name ? '/' + normalizeString(musicFile.name) : ''}`;
            const hash = createHash('sha1').update(str).digest('base64');
            await musicFile.update({ hash });
        });
    });
};

/* tslint:disable-next-line:no-empty */
export const down = () => {};
