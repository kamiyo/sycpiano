export NODE_ENV=production;
export PORT=8080;
yarn install;
yarn run build-prod;
node server/build/migrate up;
yarn start;
