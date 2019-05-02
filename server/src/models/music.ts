import { DataTypes, HasManyGetAssociationsMixin, HasManySetAssociationsMixin, Sequelize } from 'sequelize';
import { Model } from '../types';
import { musicFile } from './musicFile';

export class music extends Model {
    readonly id: string;
    readonly composer: string;
    readonly piece: string;
    readonly contributors: string;
    readonly type: string;
    readonly year: number;
    readonly musicFiles: musicFile[];
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;

    readonly getMusicFiles: HasManyGetAssociationsMixin<musicFile>;
    readonly setMusicFiles: HasManySetAssociationsMixin<musicFile, musicFile['id']>;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    music.init({
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        composer: dataTypes.STRING,
        piece: dataTypes.STRING,
        contributors: dataTypes.STRING,
        type: dataTypes.STRING,
        year: dataTypes.INTEGER,
    }, {
        sequelize,
        tableName: 'music',
    });

    music.associate = (models) => {
        music.hasMany(models.musicFile);
    };

    return music;
};
