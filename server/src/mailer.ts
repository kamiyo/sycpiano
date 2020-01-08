import * as nodemailer from 'nodemailer';
import db from './models';
import { Op } from 'sequelize';
import * as path from 'path';
import * as mustache from 'mustache';
import { promises as fs} from 'fs';

const models = db.models;

export const mailPDFs = async (skus: string[], email: string, clientRef: string) => {
    // const transport = nodemailer.createTransport({
    //     host: 'smtpout.secureserver.net',
    //     secure: true,
    //     port: 465,
    //     auth: {
    //         user: 'seanchen@seanchenpiano.com',
    //         pass: process.env.EMAIL_PASSWORD,
    //     },
    // })
    const transport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'dave14@ethereal.email',
            pass: 'ZbHs2rcZubP4EV9tWB'
        },
    });

    const products = await models.product.findAll({
        attributes: ['sku', 'file', 'title'],
        where: {
            sku: {
                [Op.in]: skus,
            },
        },
    });

    let attachments: {
        filename: string;
        path: string;
        cid?: string;
    }[] = products.map((prod) => ({
        filename: prod.file,
        path: path.resolve(__dirname, process.env.PRODUCTS_DIR, prod.file),
    }));

    attachments = [
        ...attachments,
        {
            filename: 'logo.svg',
            path: path.resolve(__dirname, '../../web/assets/images/logo.svg'),
            cid: 'logo@seanchenpiano.com',
        },
    ];

    const template = await fs.readFile(path.resolve(__dirname, '../../web/partials/email.html'), 'utf8');

    const html = mustache.render(template, {
        products: products.map((prod) => prod.title),
        clientRef,
    });
    console.log(attachments);

    const message: nodemailer.SendMailOptions = {
        from: 'Sean Chen <seanchen@seanchenpiano.com>',
        to: email,
        subject: '[Sean Chen Piano] Your recent purchased PDFs from seanchenpiano.com.',
        html,
        attachments,
    };

    try {
        const result = await transport.sendMail(message);
        console.log(nodemailer.getTestMessageUrl(result));
    } catch (e) {
        console.error(e);
    }
};