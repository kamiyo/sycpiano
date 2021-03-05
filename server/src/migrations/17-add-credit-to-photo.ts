import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: typeof DataTypes): Promise<void> => {
    const table = await queryInterface.describeTable('photo');
    if (table.credit) {
        return;
    }
    await queryInterface.addColumn('photo',
        'credit',
        {
            type: dataTypes.STRING,
            allowNull: true,
        },
    );
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeColumn('photo', 'credit');
};
