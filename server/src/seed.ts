import * as Promise from 'bluebird';
import * as path from 'path';
import * as Umzug from 'umzug';

import db from './models/index';

const sequelize = db.sequelize;

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize,
        modelName: 'seeders',
    },

    migrations: {
        params: [
            db.models, // models
            () => {
                throw new Error(`Migration tried to use old style 'done' callback. Please upgrade to 'umzug' and return a promise instead.`);
            },
        ],
        path: path.join(__dirname, 'seeders'),
        pattern: /\.js$/,
    },

    logging: (message: string) => {
        console.log(message);
    },
});

const logUmzugEvent = (eventName: string) =>
    (name: string) => {
        console.log(`${name} ${eventName}`);
    };

umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated', logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted', logUmzugEvent('reverted'));

interface MigrationWithName extends Umzug.Migration {
    name?: string;
}

interface MigrationResult {
    executed?: MigrationWithName[];
    pending?: MigrationWithName[];
}

const cmdStatus = async () => {
    const result: MigrationResult = {};

    const executed = await umzug.executed() as MigrationWithName[];
    result.executed = executed;
    const pending = await umzug.pending() as MigrationWithName[];
    result.pending = pending;

    executed.forEach((migration, index, arr) => {
        arr[index].name = path.basename(migration.file, '.js');
    });
    pending.forEach((migration, index, arr) => {
        arr[index].name = path.basename(migration.file, '.js');
    });

    const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
    const status = {
        current,
        executed: executed.map((m) => m.file),
        pending: pending.map((m) => m.file),
    };

    console.log(JSON.stringify(status, null, 2));

    return { executed, pending };
};

const cmdMigrate = (seeder: string = null) => (
    umzug.up(seeder)
);

const cmdMigrateNext = async () => {
    const { pending } = await cmdStatus();
    if (pending.length === 0) {
        return Promise.reject(new Error('No pending migrations'));
    }
    const next = pending[0].name;
    return umzug.up({ to: next });
};

const cmdReset = (seeder: string = null) => {
    if (seeder) {
        return umzug.down(seeder);
    }
    return umzug.down({ to: 0 });
};

const cmdResetPrev = async () => {
    const { executed } = await cmdStatus();
    if (executed.length === 0) {
        return Promise.reject(new Error('Already at initial state'));
    }
    const prev = executed[executed.length - 1].name;
    return umzug.down({ to: prev });
};

const main = async () => {
    const cmd = process.argv[2].trim();
    const seeder = process.argv[3] && process.argv[3].trim();
    let executedCmd: Promise<any>;

    console.log(`${cmd.toUpperCase()} BEGIN`);
    switch (cmd) {
        case 'status':
            executedCmd = Promise.resolve(cmdStatus());
            break;

        case 'up':
        case 'migrate':
            executedCmd = Promise.resolve(cmdMigrate(seeder));
            break;

        case 'next':
        case 'migrate-next':
            executedCmd = Promise.resolve(cmdMigrateNext());
            break;

        case 'down':
        case 'reset':
            executedCmd = Promise.resolve(cmdReset(seeder));
            break;

        case 'prev':
        case 'reset-prev':
            executedCmd = Promise.resolve(cmdResetPrev());
            break;

        default:
            console.log(`invalid cmd: ${cmd}`);
            process.exit(1);
    }
    try {
        await executedCmd;
        const doneStr = `${cmd.toUpperCase()} DONE`;
        console.log(doneStr);
        console.log('='.repeat(doneStr.length));
    } catch (err) {
        const errorStr = `${cmd.toUpperCase()} ERROR`;
        console.log(errorStr);
        console.log('='.repeat(errorStr.length));
        console.log(err);
        console.log('='.repeat(errorStr.length));
    }

    try {
        if (cmd !== 'status') {
            await cmdStatus();
        }
    } catch (e) {
        console.log(e);
    }
    process.exit(0);
};

main();
