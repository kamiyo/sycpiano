import { DataTypes, Sequelize } from 'sequelize';
import { Model } from '../types';

export class faq extends Model {
    readonly id?: string;
    readonly question: string;
    readonly answer: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof faq => {
    faq.init({
        id: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        question: dataTypes.TEXT,
        answer: dataTypes.TEXT,
    }, {
        sequelize,
        tableName: 'faq',
    });

    return faq;
};
