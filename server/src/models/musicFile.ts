import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';
import { music } from './music';

export class musicFile extends Model {
    readonly id?: string;
    readonly name: string;
    readonly audioFile: string;
    readonly waveformFile: string;
    readonly durationSeconds: number;
    readonly musicId?: string;
    readonly hash?: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;

    readonly getMusics: BelongsToGetAssociationMixin<music>;
    readonly setMusics: BelongsToSetAssociationMixin<music, music['id']>;
    readonly music: music;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
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
            sequelize,
            tableName: 'music_file',
        });

    musicFile.associate = (models) => {
        musicFile.belongsTo(models.music);
    };

    return musicFile;
};
