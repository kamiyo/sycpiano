The official web page of pianist Sean Chen.

It is an [express](http://expressjs.com/) app with a MySQL database, with the express app serving very little HTML. In fact, most of the app is on the client, built with [react](https://facebook.github.io/react/) and bundled with [webpack](https://webpack.github.io/).

### Getting Started
Make sure the latest stable version of Node.js is installed.
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
sycpiano uses a MySQL database, and connects to it using [sequelize](http://docs.sequelizejs.com/en/v3/).
Here are the steps for seeding the database:
* Install MySQL for your OS
* Set up a root user
* Using the root user, open up a mysql shell
```bash
# This will prompt you for root's password
$ mysql -u root -p
```
* In the mysql shell, create a new database called `sycpiano`
```mysql
mysql> create database sycpiano;
# This should also automatically switch to using the new database, but whatever.
mysql> use sycpiano;
```
* In the mysql shell, create a new user, and grant them all privileges except DROP. Basically, follow this Digital Ocean post :P https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql
* Create a `secret.js` file under the project root that contains this new user's username and password. Don't worry, this file is in our `.gitignore`! Make sure that object exported by `secret.js` contains the keys `username` and `password`. This file will be used when connecting to the database to create tables that do not exist.
* Run `scripts/seedDB.js`
```bash
# From project root
$ node scripts/seedDB.js
```
When it asks for your usename and password, you can provide those of any MySQL user that has INSERT privilege. The file path you provide (as the third argument) must be a JSON file, and the objects of that JSON file must match the schema of the sequelize models defined under `server/models/`.

Remember, before running `npm start`, make sure the mysql server is running:
```bash
# start the mysql server
$ sudo /etc/init.d/mysql start
```
