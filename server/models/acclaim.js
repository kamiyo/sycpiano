const Acclaim = (sequelize, DataTypes) => (
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

module.exports = Acclaim;
