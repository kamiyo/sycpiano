import { DataTypes, Sequelize } from 'sequelize';
import { CollaboratorModel } from 'types';

const Collaborator = (sequelize: Sequelize, dataTypes: DataTypes) => {
    const collaborator = sequelize.define('collaborator', {
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        name: dataTypes.STRING,
    }) as CollaboratorModel;

    collaborator.associate = (models) => {
        collaborator.hasMany(models.calendarCollaborator);
        collaborator.belongsToMany(models.calendar, { through: models.calendarCollaborator });
    };

    return collaborator;
};

export default Collaborator;
