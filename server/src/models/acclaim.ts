import { Sequelize, DataTypes } from "sequelize";

const Acclaim = (sequelize: Sequelize, DataTypes: DataTypes) => (
    sequelize.define('acclaim', {
        quote: {
            type: DataTypes.TEXT,
            field: 'quote',
        },
        short: {
            type: DataTypes.TEXT,
            field: 'short',
        },
        author: {
            type: DataTypes.STRING,
            field: 'author',
        },
        shortAuthor: {
            type: DataTypes.STRING,
            field: 'shortAuthor',
        },
        date: {
            type: DataTypes.STRING,
            field: 'date',
        },
    })
);

export default Acclaim;
