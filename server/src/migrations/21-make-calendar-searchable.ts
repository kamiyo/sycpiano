import { QueryInterface } from 'sequelize';

const vectorName = '_search';

const searchObjects: {
    [key: string]: string[];
} = {
    calendar: ['name', 'location', 'type'],
    piece: ['composer', 'piece'],
    collaborator: ['name', 'instrument'],
};

// CREATE EXTENSION unaccent <= must run as root
export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.transaction(async (t) => {
        try {
            await queryInterface.sequelize.query(`
                CREATE TEXT SEARCH CONFIGURATION en ( COPY = english );
                ALTER TEXT SEARCH CONFIGURATION en
                ALTER MAPPING FOR hword, hword_part, word
                WITH unaccent, english_stem;
            `, { transaction: t });
            await Promise.all(Object.keys(searchObjects).map(async (table) => {
                await queryInterface.sequelize.query(`
                    ALTER TABLE ${table} ADD COLUMN ${vectorName} TSVECTOR;
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    UPDATE ${table} SET ${vectorName} = to_tsvector('en', ${searchObjects[table].join(` || ' ' || `)});
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    CREATE INDEX ${table}_search ON ${table} USING gin(${vectorName});
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    CREATE TRIGGER ${table}_vector_update
                    BEFORE INSERT OR UPDATE ON ${table}
                    FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'public.en', ${searchObjects[table].join(', ')});
                `, { transaction: t });
            }));
        } catch (e) {
            console.log(e);
        }
    });
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.transaction(async (t) => {
        try {
            await queryInterface.sequelize.query(`
                DROP TEXT SEARCH CONFIGURATION IF EXISTS en
            `, { transaction: t });
            await Promise.all(Object.keys(searchObjects).map(async (table) => {
                await queryInterface.sequelize.query(`
                    DROP TRIGGER IF EXISTS ${table}_vector_update ON ${table};
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    DROP INDEX IF EXISTS ${table}_search;
                `, { transaction: t });
                await queryInterface.sequelize.query(`
                    ALTER TABLE ${table} DROP COLUMN IF EXISTS ${vectorName};
                `, { transaction: t });
            }));
        } catch (e) {
            console.log(e);
        }
    });
};
