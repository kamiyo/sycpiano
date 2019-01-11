import { DataTypes, Sequelize } from 'sequelize';
import { DiscLinkModel } from 'types';

const DiscLink = (sequelize: Sequelize, dataTypes: DataTypes) => {
    const discLink = sequelize.define('discLink', {
        id: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        type: dataTypes.STRING,
        url: dataTypes.STRING,
        discId: {
            type: dataTypes.UUID,
            field: 'disc_id',
        },
    }, { tableName: 'disc_link' }) as DiscLinkModel;

    discLink.associate = (models) => {
        discLink.belongsTo(models.disc);
    };

    return discLink;
};

export default DiscLink;
