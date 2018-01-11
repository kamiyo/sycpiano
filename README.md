# The official web page of pianist Sean Chen.

It is an [express](http://expressjs.com/) app with a PostgreSQL database, with the express app serving very little HTML. In fact, most of the app is on the client, built with [react](https://facebook.github.io/react/) and bundled with [webpack](https://webpack.github.io/). Use [yarn](https://yarnpkg.com/en/) for package management. Code is in [typescript](https://www.typescriptlang.org/) and [less](http://lesscss.org/).

## Getting Started
Make sure at least version 8.4.0 of Node.js is installed.
After you've cloned the repository and have navigated to the project root, run:
```
$ yarn install
```
After installing your node dependencies, you're ready to start dev process.
```
$ yarn run start-dev
```
et Voila! This command will run a gulp task that starts the server and watches for changes you make to your code, in which case it will trigger a rebuild.

## Production
TODO: MORE
First, setup a .env file with at least these entries:
```
DB_NAME=<database name, probably sycpiano>
DB_HOST=<production host, probably loopback: 127.0.0.1>
DB_USER=<username>
DB_PASS=<password>
DB_PORT=<database port>
DB_DIALECT=<sql dialect>
PORT=<http production port number>
```
If deploying on heroku, make sure `DB_URL` is set, which contains the above info.

Then, run:
```
$ yarn run start-prod
```

Make sure: disable happyPack thread pools if you only have one core. Because of that, it might be better to directly run npm start or node app.js, after setting the correct environmental variabls.
Also, make sure that it is not in a subPath, (i.e. project root must be /, not /somePath relative to the domain).
Change database type to match the server (mddhosting uses MariaDB, heroku uses Postgres).

## Initializing the database
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
module.exports = {
  username: <username>,
  password: <password>
};
```

## Migrations and Seeding
sycpiano uses umzug and sequelize for migrations.
```
$ node server/build/migrate [up|down]
$ node server/build/seed [up|down]
```

Run `yarn run start-dev` or at least `yarn run build-server` so that the server/build folder actually has .js files!

Remember, before running `yarn run start-dev`, make sure the postgres server is running.

## Admin
sycpiano uses the Lumber framework for accessing the database.
Right now, it is dev only. Make sure you have the .env file (or ask kamiyo).
```
$ cd admin
$ yarn install
```
To run:
```
$ cd admin
$ node bin/www
```
and follow the command line instructions.
Make sure if you change any of the models in the server to also paste the built .js files into the model folder of admin.

TODO: deploy admin

## Utilities

### Audio Waveforms
There is a waveform generation utility script included in web/assets/music called genWaveform.sh.
```
$ genWaveform.sh -i input.mp3 -l desiredWaveformLength
```
Must have the [audiowaveform](https://github.com/bbc/audiowaveform) package installed (linux or macosx only, windows via WSL). Only does mp3 files. For now, `desiredWaveformLength = 1024`.

### Picture Thumbnails
There is a thumbanil generation utility (and creates .json file for seeding the photos table in the database) in web/assets/images called generateThumbnails.js
```
$ node generateThumbnails
```
Must have [graphicsmagick](http://www.graphicsmagick.org/) and [imagemagick](https://www.imagemagick.org/script/index.php) installed, as well as [opencv](https://github.com/opencv).