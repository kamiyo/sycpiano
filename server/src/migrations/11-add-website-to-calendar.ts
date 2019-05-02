import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    await queryInterface.addColumn('calendar',
        'website',
        {
            type: dataTypes.STRING,
            allowNull: true,
        },
    );
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('calendar', 'website');
};
