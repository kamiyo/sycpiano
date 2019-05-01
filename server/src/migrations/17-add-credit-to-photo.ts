import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    const table = await queryInterface.describeTable('photo');
    if ((table as any).credit) {
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

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('photo', 'credit');
};
