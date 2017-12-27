import { Sequelize, DataTypes } from "sequelize";
import { AcclaimModel } from "types";

const Acclaim = (sequelize: Sequelize, DataTypes: DataTypes) => (
    sequelize.define('acclaim', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        quote: DataTypes.TEXT,
        short: DataTypes.TEXT,
        author: DataTypes.STRING,
        shortAuthor: DataTypes.STRING,
        date: DataTypes.STRING,
    }) as AcclaimModel
);

export default Acclaim;
