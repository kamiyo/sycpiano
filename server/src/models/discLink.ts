import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class discLink extends Model {
    readonly id?: string;
    readonly type: string;
    readonly url: string;
    readonly discId: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    discLink.init({
        id: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        type: dataTypes.STRING,
        url: dataTypes.STRING,
        discId: {
            type: dataTypes.UUID,
            field: 'disc_id',
        },
    }, {
            sequelize,
            tableName: 'disc_link',
        });

    discLink.associate = (models) => {
        discLink.belongsTo(models.disc);
    };

    return discLink;
};
