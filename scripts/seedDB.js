// Seed data in the local DB.
const _ = require('lodash');
const jsonfile = require('jsonfile');
const prompt = require('prompt');
const Sequelize = require('sequelize');
const importModels = require('../server/models').importModels;

const schema = {
    properties: {
        username: { required: true },
        password: { required: true, hidden: true },
        // Should be a JSON file.
        JSONFilePath: { required: true },
    }
};

/**
 * Given a file path, extracts the file name excluding the extension.
 * @param  {string} filepath - e.g. /Users/derp/Documents/coolstuff.json
 * @return {string} e.g. coolstuff
 */
function getFilenameWithoutExtension(filepath) {
    const withExtension = filepath.split('/').pop();
    // We assume there will only be one '.' char in the name.
    // Example: acclaim.json
    return withExtension.split('.')[0];
}

function startPrompt() {
    prompt.start();
    console.log('Please provide a user and password for the sycpiano DB');
}

function promptForInput() {
    prompt.get(schema, (err, result) => {
        if (err) throw err;

        const DBName = 'sycpiano';
        const username = result.username;
        const password = result.password;
        const filepath = result.JSONFilePath;

        // Create a database connection using the given username/pw.
        // The corresponding user should have INSERT permission to the database.
        const sequelize = new Sequelize(DBName, username, password, {
            host: 'localhost',
            dialect: 'mysql',
            pool: { max: 5, min: 0, idle: 10000 },
        });
        const models = importModels(sequelize);

        // Read from the provided JSON file path.
        // This is async, so we're guaranteed that we'll exit this stack frame
        // before ever executing the "inner" promptForInput() call.
        // This means that we don't need to worry about multiple database
        // connections being created.
        jsonfile.readFile(filepath, (err, content) => {
            if (err) throw err;

            const fileName = _.startCase(getFilenameWithoutExtension(filepath));
            if (!models.hasOwnProperty(fileName)) {
                console.log('Error: The name of the file must correspond to a model name.');
                promptForInput();
                return;
            }

            const attrsArray = _.each(content, obj => _.omit(obj, ['ID']));
            models[fileName].bulkCreate(attrsArray).then(
                () => console.log('Done! Happy coding!')
            );
        });
    });
}

startPrompt();
promptForInput();
