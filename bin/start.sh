export NODE_ENV=production;
export PORT=443;
yarn run build-prod;
node server/build/migrate up;
nohup yarn start &
