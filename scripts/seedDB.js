// Seed data in the local DB.
const _ = require('lodash');
const jsonfile = require('jsonfile');
const prompt = require('prompt');
const Sequelize = require('sequelize');

const initDB = require('../server/initDB.js');
const sequelize = require('../sequelize.js');
const importModels = require('../server/models').importModels;

const schema = { properties: { JSONFilePath: { required: true } } };

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
    console.log('Please provide the file name containing the data to seed.');
}

function promptForInput() {
    prompt.get(schema, (err, result) => {
        if (err) throw err;

        const filepath = result.JSONFilePath;
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

initDB().then(() => {
    startPrompt();
    promptForInput();
});
