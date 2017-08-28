The official web page of pianist Sean Chen.

It is an [express](http://expressjs.com/) app with a PostgreSQL database, with the express app serving very little HTML. In fact, most of the app is on the client, built with [react](https://facebook.github.io/react/) and bundled with [webpack](https://webpack.github.io/).

### Getting Started
Make sure at least version 8.4.0 of Node.js is installed.
After you've cloned the repository and have navigated to the project root, run:
```
$ npm install
```
After installing your node dependencies, you're ready to start dev process.
```
$ npm run start-dev
```
Voila! This command will run a gulp task that starts the server and watches for changes you make to your code, in which case it will trigger a rebuild.

## Seeding the database
sycpiano uses a PostgreSQL database, and connects to it using [sequelize](http://docs.sequelizejs.com/en/v3/).
Here are the steps for seeding the database:
* Install PostgreSQL for your OS
* Using the root user, open up a psql shell. On windows, the user's name will be `postgres`. On OSX, if you installed postgres through `brew`, then it'll be whatever your root user's name is. One way to find out is to do `psql -l` and see who the owner of the `postgres` database is. Once you've figured out the root user, run this command:
```bash
$ psql -U <username>
```
* In the psql shell, create a new database called `sycpiano`
```psql
postgres=# create database sycpiano;
# This should also automatically switch to using the new database, but whatever.
postgres=# \connect sycpiano;
```
* In the postgres shell, create a new user
```
create role <username> with login password '<quoted password>'
```
* Create a `secret.js` file under the project root that contains this new user's username and password. Don't worry, this file is in our `.gitignore`! Make sure that object exported by `secret.js` contains the keys `username` and `password`. This file will be used when connecting to the database to create tables that do not exist. It will look something like this:
```
modules.export = {
  username: <username>,
  password: <password>
};
```
* Run `scripts/seedDB.js`
```bash
# From project root
$ node scripts/seedDB.js
```
When it asks for your usename and password, you can provide those of any postgres user that has INSERT privilege. The file path you provide (as the third argument) must be a JSON file, and the objects of that JSON file must match the schema of the sequelize models defined under `server/models/`.

Remember, before running `npm run start-dev`, make sure the postgres server is running.
