import * as Promise from 'bluebird';
import { ModelMap, MusicModel } from 'types';
import { getHash } from '../hash';

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
            const hash = getHash(composer, piece, musicFile.name);
            await musicFile.update({ hash });
        });
    });
};

/* tslint:disable-next-line:no-empty */
export const down = () => {};
