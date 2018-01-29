export NODE_ENV=production;
export PORT=80;
yarn run build-prod;
node server/build/migrate up;
yarn start
