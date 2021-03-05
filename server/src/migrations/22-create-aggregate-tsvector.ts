import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<[unknown[], unknown]> => (
    await queryInterface.sequelize.query(`
        CREATE AGGREGATE tsvector_agg (tsvector) (
            SFUNC = tsvector_concat,
            STYPE = tsvector
        );
    `)
);

export const down = async (queryInterface: QueryInterface): Promise<[unknown[], unknown]> => (
    await queryInterface.sequelize.query(`
        DROP AGGREGATE IF EXISTS tsvector_agg(tsvector);
    `)
);
