import { DataTypes, HasManyGetAssociationsMixin, Sequelize } from 'sequelize';
import { Model } from '../types';
import { discLink } from './discLink';

export class disc extends Model {
    readonly id?: string;
    readonly title: string;
    readonly description: string;
    readonly label: string;
    readonly releaseDate: Date | string;
    readonly thumbnailFile: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;

    readonly getDiscLinks: HasManyGetAssociationsMixin<discLink>;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof disc => {
    disc.init({
        id: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        title: dataTypes.STRING,
        description: dataTypes.STRING,
        label: dataTypes.STRING,
        releaseDate: {
            type: dataTypes.INTEGER,
            field: 'release_date',
        },
        thumbnailFile: {
            type: dataTypes.STRING,
            field: 'thumbnail_file',
        },
    }, {
        sequelize,
        tableName: 'disc',
    });

    disc.associate = (models) => {
        disc.hasMany(models.discLink);
    };

    return disc;
};
