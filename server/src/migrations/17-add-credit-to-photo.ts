import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: DataTypes) => {
    await queryInterface.addColumn('photo',
        'credit',
        {
            type: dataTypes.STRING,
            allowNull: true,
        },
    );
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('photo', 'credit');
};
