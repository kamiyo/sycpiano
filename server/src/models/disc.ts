import { DataTypes, Sequelize } from 'sequelize';
import { DiscModel } from 'types';

const Disc = (sequelize: Sequelize, dataTypes: DataTypes) => {
    const disc = sequelize.define('disc', {
        id: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        title: dataTypes.STRING,
        description: dataTypes.STRING,
        label: dataTypes.STRING,
        releaseDate: {
            type: dataTypes.INTEGER,
            field: 'release_date',
        },
        thumbnailFile: {
            type: dataTypes.STRING,
            field: 'thumbnail_file',
        },
    }) as DiscModel;

    disc.associate = (models) => {
        disc.hasMany(models.discLink);
    };

    return disc;
};

export default Disc;
