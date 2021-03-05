import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Sequelize } from 'sequelize';
import { getHash } from '../hash';
import { Model } from '../types';
import { music } from './music';

export class musicFile extends Model {
    readonly id?: string;
    name: string;
    readonly audioFile: string;
    readonly waveformFile: string;
    readonly durationSeconds: number;
    readonly musicId?: string;
    hash?: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;

    readonly getMusic: BelongsToGetAssociationMixin<music>;
    readonly setMusic: BelongsToSetAssociationMixin<music, music['id']>;
    readonly music: music;
}

const hookFn = async (mFile: musicFile, _: any) => {
    console.log(`[musicFile Hook beforeCreate/Update]`);
    try {
        if (mFile.musicId) {
            const m: music = await mFile.getMusic();
            console.log(`Updating hash for ${mFile.id}.`);
            /* eslint-disable-next-line require-atomic-updates */
            mFile.hash = getHash(m.composer, m.piece, mFile.name);
        }
    } catch (error) {
        console.log('error beforecreate hook', error);
    }
    console.log(`[End Hook]\n`);
};

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof musicFile => {
    musicFile.init({
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        name: dataTypes.STRING,
        audioFile: {
            type: dataTypes.STRING,
            field: 'audio_file',
        },
        waveformFile: {
            type: dataTypes.STRING,
            field: 'waveform_file',
        },
        durationSeconds: {
            type: dataTypes.INTEGER,
            field: 'duration_seconds',
        },
        musicId: {
            type: dataTypes.UUID,
            field: 'music_id',
        },
        hash: dataTypes.STRING,
    }, {
            hooks: {
                beforeCreate: hookFn,
                beforeUpdate: hookFn,
            },
            sequelize,
            tableName: 'music_file',
        });

    musicFile.associate = (models) => {
        musicFile.belongsTo(models.music);
    };

    return musicFile;
};
