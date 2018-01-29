yarn run build-prod;
node server/build/migrate up;
NODE_ENV=production yarn start;
