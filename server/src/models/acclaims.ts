import { Sequelize, DataTypes } from "sequelize";

const Acclaim = (sequelize: Sequelize, DataTypes: DataTypes) => (
    sequelize.define('acclaims', {
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
    }, {
        timestamps: false,
    })
);

export default Acclaim;
