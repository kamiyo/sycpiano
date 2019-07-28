import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class calendarPiece extends Model {
    readonly id?: string;
    readonly CalendarId?: string;
    readonly PieceId?: string;
    readonly order?: number;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    calendarPiece.init({
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
        pieceId: {
            type: dataTypes.UUID,
            field: 'piece_id',
        },
        order: dataTypes.INTEGER,
    }, {
            sequelize,
            tableName: 'calendar_piece',
        });

    calendarPiece.associate = (models) => {
        calendarPiece.belongsTo(models.calendar);
        calendarPiece.belongsTo(models.piece);
    };

    return calendarPiece;
};
