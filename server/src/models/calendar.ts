import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    DataTypes,
    Sequelize,
} from 'sequelize';

import { Model } from '../types';
import { collaborator } from './collaborator';
import { piece } from './piece';

export class calendar extends Model {
    readonly id?: string;
    readonly name: string;
    readonly dateTime: Date | string;
    readonly allDay: boolean;
    readonly endDate: Date | string;
    readonly timezone: string;
    readonly location: string;
    readonly type: string;
    readonly website: string;
    readonly collaborators?: collaborator[];
    readonly pieces?: piece[];
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;

    getPieces: BelongsToManyGetAssociationsMixin<piece>;
    setPieces: BelongsToManySetAssociationsMixin<piece, piece['id']>;
    addPiece: BelongsToManyAddAssociationMixin<piece, piece['id']>;
    addPieces: BelongsToManyAddAssociationsMixin<piece, piece['id']>;
    removePiece: BelongsToManyRemoveAssociationMixin<piece, piece['id']>;
    removePieces: BelongsToManyRemoveAssociationsMixin<piece, piece['id']>;
    countPieces: BelongsToManyCountAssociationsMixin;

    getCollaborators: BelongsToManyGetAssociationsMixin<collaborator>;
    setCollaborators: BelongsToManySetAssociationsMixin<collaborator, collaborator['id']>;
    addCollaborator: BelongsToManyAddAssociationMixin<collaborator, collaborator['id']>;
    addCollaborators: BelongsToManyAddAssociationsMixin<collaborator, collaborator['id']>;
    removeCollaborator: BelongsToManyRemoveAssociationMixin<collaborator, collaborator['id']>;
    removeCollaborators: BelongsToManyRemoveAssociationsMixin<collaborator, collaborator['id']>;
    countCollaborators: BelongsToManyCountAssociationsMixin;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    calendar.init({
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: dataTypes.STRING,
            unique: true,
        },
        name: dataTypes.STRING,
        dateTime: {
            type: dataTypes.DATE,
            field: 'date_time',
        },
        allDay: {
            type: dataTypes.BOOLEAN,
            field: 'all_day',
        },
        endDate: {
            type: dataTypes.DATEONLY,
            field: 'end_date',
        },
        timezone: dataTypes.STRING,
        location: dataTypes.STRING,
        type: dataTypes.STRING,
        website: dataTypes.STRING,
    }, {
            sequelize,
            tableName: 'calendar',
        });

    calendar.associate = (models) => {
        calendar.hasMany(models.calendarPiece);
        calendar.hasMany(models.calendarCollaborator);
        calendar.belongsToMany(models.piece, { through: models.calendarPiece });
        calendar.belongsToMany(models.collaborator, { through: models.calendarCollaborator });
    };

    return calendar;
};
