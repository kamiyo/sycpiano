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

    collaborator.associate = (db) => {
        collaborator.hasMany(db.calendarCollaborator);
        collaborator.belongsToMany(db.calendar, { through: db.calendarCollaborator });
    };

    return collaborator;
};

export default Collaborator;
