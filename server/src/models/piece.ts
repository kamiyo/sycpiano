import { DataTypes, Sequelize } from 'sequelize';
import { PieceModel } from 'types';

const Piece = (sequelize: Sequelize, dataTypes: DataTypes) => {
    const piece = sequelize.define('piece', {
        id: {
            allowNull: false,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            type: dataTypes.UUID,
            unique: true,
        },
        piece: dataTypes.STRING,
    }) as PieceModel;

    piece.associate = (db) => {
        piece.hasMany(db.calendarDetail);
        piece.belongsToMany(db.calendar, { through: db.calendarDetail });
    };

    return piece;
};

export default Piece;
