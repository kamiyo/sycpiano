export NODE_ENV=production;
export PORT=8080;
yarn install;
yarn run build-prod;
node server/build/seed down;
node server/build/seed up;
node server/build/migrate up;
pm2 start app.js --name sycpiano;
