export NODE_ENV=production;
yarn run build-prod;
node server/build/migrate up;
yarn start;
