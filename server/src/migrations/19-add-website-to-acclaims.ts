import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: typeof DataTypes): Promise<void> => {
    const acclaim = await queryInterface.describeTable('acclaim');
    if (!Object.prototype.hasOwnProperty.call(acclaim, 'website')) {
        await queryInterface.addColumn('acclaim',
            'website',
            {
                type: dataTypes.STRING,
                allowNull: true,
            },
        );
    }
    if (!Object.prototype.hasOwnProperty.call(acclaim, 'has_full_date')) {
        await queryInterface.addColumn('acclaim',
            'has_full_date',
            {
                type: dataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        );
    }
    if (!Object.prototype.hasOwnProperty.call(acclaim, 'old_date')) {
        await queryInterface.renameColumn('acclaim', 'date', 'old_date');
        await queryInterface.addColumn('acclaim',
            'date',
            {
                type: dataTypes.DATEONLY,
                allowNull: true,
            },
        );
    } else {
        if (!Object.prototype.hasOwnProperty.call(acclaim, 'date')) {
            await queryInterface.addColumn('acclaim',
                'date',
                {
                    type: dataTypes.DATEONLY,
                    allowNull: true,
                },
            );
        }
    }
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    const acclaim = await queryInterface.describeTable('acclaim');
    Object.prototype.hasOwnProperty.call(acclaim, 'website') && await queryInterface.removeColumn('acclaim', 'website');
    Object.prototype.hasOwnProperty.call(acclaim, 'has_full_date') && await queryInterface.removeColumn('acclaim', 'has_full_date');
    Object.prototype.hasOwnProperty.call(acclaim, 'date') && await queryInterface.removeColumn('acclaim', 'date');
    Object.prototype.hasOwnProperty.call(acclaim, 'old_date') && await queryInterface.renameColumn('acclaim', 'old_date', 'date');
};
