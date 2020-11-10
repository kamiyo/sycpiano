import * as forest from 'forest-express-sequelize';

process.env.NODE_ENV === 'development' && forest.collection('product', {
    actions: [
        { name: 'Populate Test Data', type: 'global' },
    ],
});

export {};
