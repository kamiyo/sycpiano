import { QueryInterface } from 'sequelize';

const vectorName = '_search';

const searchObjects: {
    [key: string]: string[];
} = {
    calendar: ['name', 'location', 'type'],
    piece: ['composer', 'piece'],
    collaborator: ['name', 'instrument'],
};

export const up = (queryInterface: QueryInterface) => (
    queryInterface.sequelize.transaction(async (t) => {
        try {
            await Promise.all(Object.keys(searchObjects).map(async (table) => {
                await queryInterface.sequelize.query(`
                    ALTER TABLE ${table} ADD COLUMN ${vectorName} TSVECTOR;
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    UPDATE ${table} SET ${vectorName} = to_tsvector('english', ${searchObjects[table].join(` || ' ' || `)});
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    CREATE INDEX ${table}_search ON ${table} USING gin(${vectorName});
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    CREATE TRIGGER ${table}_vector_update
                    BEFORE INSERT OR UPDATE ON ${table}
                    FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'pg_catalog.english', ${searchObjects[table].join(', ')});
                `, { transaction: t });
            }));
        } catch (e) {
            console.log(e);
        }
    })
);

export const down = (queryInterface: QueryInterface) => (
    queryInterface.sequelize.transaction(async (t) => {
        try {
            Promise.all(Object.keys(searchObjects).map(async (table) => {
                await queryInterface.sequelize.query(`
                    DROP TRIGGER ${table}_vector_update ON ${table};
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    DROP INDEX ${table}_search;
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    ALTER TABLE ${table} DROP COLUMN ${vectorName};
                `, { transaction: t });
            }));
        } catch (e) {
            console.log(e);
        }
    })
);
