import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    await queryInterface.addColumn('calendar',
        'all_day',
        {
            type: dataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
    );
    await queryInterface.addColumn('calendar',
        'end_date',
        {
            type: dataTypes.DATEONLY,
            allowNull: true,
        },
    );
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('calendar', 'all_day');
    await queryInterface.removeColumn('calendar', 'end_date');
};
