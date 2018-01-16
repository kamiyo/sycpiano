import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: DataTypes) => {
    await queryInterface.addColumn('collaborator',
        'instrument',
        {
            type: dataTypes.STRING,
            allowNull: true,
        });
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('collaborator', 'instrument');
};
