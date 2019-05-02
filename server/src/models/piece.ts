import { BelongsToManyCountAssociationsMixin, DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

export class piece extends Model {
    public readonly id: string;
    public readonly composer: string;
    public readonly piece: string;
    public readonly createdAt?: Date | string;
    public readonly updatedAt?: Date | string;

    countCalendars: BelongsToManyCountAssociationsMixin;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    piece.init({
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        composer: dataTypes.STRING,
        piece: dataTypes.STRING,
    }, {
            sequelize,
            tableName: 'piece',
        });

    piece.associate = (models) => {
        piece.hasMany(models.calendarPiece);
        piece.belongsToMany(models.calendar, { through: models.calendarPiece });
    };

    return piece;
};
