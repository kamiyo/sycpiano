import * as nodemailer from 'nodemailer';
import db from './models';
import { Op } from 'sequelize';
import * as path from 'path';
import * as mustache from 'mustache';
import { promises as fsAsync, default as fs } from 'fs';
import * as moment from 'moment';

const models = db.models;

const transportOptions = (process.env.NODE_ENV === 'production') ? {
    host: 'smtpout.secureserver.net',
    secure: true,
    port: 465,
    auth: {
        user: 'seanchen@seanchenpiano.com',
        pass: process.env.EMAIL_PASSWORD,
    },
    dkim: {
        domainName: 'seanchenpiano.com',
        keySelector: 'email',
        privateKey: fs.readFileSync(path.resolve(__dirname, process.env.EMAIL_PRIVATE_KEY_FILE), 'utf8'),
    },
} : {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'dave14@ethereal.email',
            pass: 'ZbHs2rcZubP4EV9tWB'
        },
    };

// To email a manual request, omit clientRef (or pass falsey value)
export const emailPDFs = async (productIDs: string[], email: string, clientRef?: string) => {
    const transport = nodemailer.createTransport(transportOptions);

    const products = await models.product.findAll({
        attributes: ['id', 'file', 'title'],
        where: {
            id: {
                [Op.in]: productIDs,
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
            filename: 'logo.png',
            path: path.resolve(__dirname, '../../web/assets/images/email_logo.png'),
            cid: 'logo@seanchenpiano.com',
        },
    ];

    const template = await fsAsync.readFile(path.resolve(__dirname, '../../web/partials/email.html'), 'utf8');

    const html = mustache.render(template, {
        products: products.map((prod) => prod.name),
        clientRef,
        year: moment().year(),
    });
    console.log(attachments);

    const message: nodemailer.SendMailOptions = {
        from: 'Sean Chen Piano Shop <shop@seanchenpiano.com>',
        replyTo: 'seanchen@seanchenpiano.com',
        to: email,
        subject: '[Sean Chen Piano] Your recent purchased PDFs from seanchenpiano.com.',
        html,
        attachments,
    };

    const result = await transport.sendMail(message);
    if (process.env.NODE_ENV === 'development') {
        console.log(nodemailer.getTestMessageUrl(result));
    }
};