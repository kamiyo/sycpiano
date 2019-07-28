import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class calendarCollaborator extends Model {
    readonly id?: string;
    readonly calendarId?: string;
    readonly collaboratorId?: string;
    readonly order?: number;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    calendarCollaborator.init({
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        calendarId: {
            type: dataTypes.STRING,
            field: 'calendar_id',
        },
        collaboratorId: {
            type: dataTypes.UUID,
            field: 'collaborator_id',
        },
        order: dataTypes.INTEGER,
    }, {
            sequelize,
            tableName: 'calendar_collaborator',
        });

    calendarCollaborator.associate = (models) => {
        calendarCollaborator.belongsTo(models.calendar);
        calendarCollaborator.belongsTo(models.collaborator);
    };

    return calendarCollaborator;
};
