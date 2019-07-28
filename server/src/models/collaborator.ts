import { BelongsToManyCountAssociationsMixin, DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class collaborator extends Model {
    readonly id: string;
    readonly name: string;
    readonly instrument: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;

    countCalendars: BelongsToManyCountAssociationsMixin;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    collaborator.init({
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        name: dataTypes.STRING,
        instrument: dataTypes.STRING,
    }, {
            sequelize,
            tableName: 'collaborator',
        });

    collaborator.associate = (models) => {
        collaborator.hasMany(models.calendarCollaborator);
        collaborator.belongsToMany(models.calendar, { through: models.calendarCollaborator });
    };

    return collaborator;
};
