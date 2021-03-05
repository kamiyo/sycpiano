import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: typeof DataTypes): Promise<void> => {
    await queryInterface.addColumn('calendar_piece',
        'order',
        {
            type: dataTypes.INTEGER,
            allowNull: true,
        },
    );
    await queryInterface.addColumn('calendar_collaborator',
        'order',
        {
            type: dataTypes.INTEGER,
            allowNull: true,
        },
    );
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeColumn('calendar_piece', 'order');
    await queryInterface.removeColumn('calendar_collaborator', 'order');
};
