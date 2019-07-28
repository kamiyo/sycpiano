import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class photo extends Model {
    readonly id?: string;
    readonly file: string;
    readonly credit: string;
    readonly width: number;
    readonly height: number;
    readonly thumbnailWidth: number;
    readonly thumbnailHeight: number;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    photo.init({
        id: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        file: dataTypes.STRING,
        credit: dataTypes.STRING,
        width: dataTypes.INTEGER,
        height: dataTypes.INTEGER,
        thumbnailWidth: {
            type: dataTypes.INTEGER,
            field: 'thumbnail_width',
        },
        thumbnailHeight: {
            type: dataTypes.INTEGER,
            field: 'thumbnail_height',
        },
    }, {
            sequelize,
            tableName: 'photo',
        });

    return photo;
};
