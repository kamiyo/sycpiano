import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class acclaim extends Model {
    readonly id?: string;
    readonly quote: string;
    readonly short: string;
    readonly author: string;
    readonly shortAuthor: string;
    readonly date: Date | string;
    readonly oldDate?: string;
    readonly hasFullDate?: boolean;
    readonly website: string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    acclaim.init({
        id: {
            type: dataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        quote: dataTypes.TEXT,
        short: dataTypes.TEXT,
        author: dataTypes.STRING,
        shortAuthor: {
            type: dataTypes.STRING,
            field: 'short_author',
        },
        website: dataTypes.STRING,
        date: dataTypes.DATEONLY,
        oldDate: {
            type: dataTypes.STRING,
            field: 'old_date',
        },
        hasFullDate: {
            type: dataTypes.BOOLEAN,
            field: 'has_full_date',
        },
    }, {
            sequelize,
            tableName: 'acclaim',
        });

    return acclaim;
};
