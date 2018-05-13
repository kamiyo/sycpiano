import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface, dataTypes: DataTypes) => {
    const acclaim = await queryInterface.describeTable('acclaim');
    if (!acclaim.hasOwnProperty('website')) {
        await queryInterface.addColumn('acclaim',
            'website',
            {
                type: dataTypes.STRING,
                allowNull: true,
            },
        );
    }
    if (!acclaim.hasOwnProperty('has_full_date')) {
        await queryInterface.addColumn('acclaim',
            'has_full_date',
            {
                type: dataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        );
    }
    if (!acclaim.hasOwnProperty('old_date')) {
        await queryInterface.renameColumn('acclaim', 'date', 'old_date');
        await queryInterface.addColumn('acclaim',
            'date',
            {
                type: dataTypes.DATEONLY,
                allowNull: true,
            },
        );
    } else {
        if (!acclaim.hasOwnProperty('date')) {
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

export const down = async (queryInterface: QueryInterface) => {
    const acclaim = await queryInterface.describeTable('acclaim');
    acclaim.hasOwnProperty('website') && await queryInterface.removeColumn('acclaim', 'website');
    acclaim.hasOwnProperty('has_full_date') && await queryInterface.removeColumn('acclaim', 'has_full_date');
    acclaim.hasOwnProperty('date') && await queryInterface.removeColumn('acclaim', 'date');
    acclaim.hasOwnProperty('old_date') && await queryInterface.renameColumn('acclaim', 'old_date', 'date');
};
