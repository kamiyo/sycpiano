import * as moment from 'moment';
import { default as Sequelize } from 'sequelize';
import { acclaim } from './models/acclaim';
import { bio } from './models/bio';
import { calendar } from './models/calendar';
import { calendarCollaborator } from './models/calendarCollaborator';
import { calendarPiece } from './models/calendarPiece';
import { collaborator } from './models/collaborator';
import { disc } from './models/disc';
import { discLink } from './models/discLink';
import { music } from './models/music';
import { musicFile } from './models/musicFile';
import { photo } from './models/photo';
import { piece } from './models/piece';
import { token } from './models/token';
import { product } from './models/product';
import { customer } from 'models/customer';

type Moment = moment.Moment;

export interface GCalEvent {
    readonly description: any;
    readonly id: string;
    readonly location: string;
    readonly start: {
        readonly dateTime?: Moment;
        readonly date?: Moment;
        readonly timeZone?: string;
    };
    readonly summary: string;
    readonly [key: string]: any; // other params
}

export type ModelCtor<M extends Model> = typeof Sequelize.Model & (new () => M);

export class Model<T extends {} = any, T2 extends {} = any> extends Sequelize.Model<T, T2> {
    static associate?(db: {[key: string]: ModelCtor<any>}): void;
    readonly dataValues: T;
}

export interface ModelMap {
    acclaim: typeof acclaim;
    bio: typeof bio;
    calendar: typeof calendar;
    calendarCollaborator: typeof calendarCollaborator;
    calendarPiece: typeof calendarPiece;
    collaborator: typeof collaborator;
    disc: typeof disc;
    discLink: typeof discLink;
    music: typeof music;
    musicFile: typeof musicFile;
    photo: typeof photo;
    piece: typeof piece;
    token: typeof token;
    product: typeof product;
    customer: typeof customer;
    [key: string]: typeof Model;
}

export interface DB {
    readonly sequelize: Sequelize.Sequelize;
    importModels: (seq: Sequelize.Sequelize) => ModelMap;
    readonly models: ModelMap;
}

export interface ShopItem {
    readonly description: string;
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly images: string[];
    readonly format?: string;
    readonly pages?: number;
    readonly sample?: string;
    readonly permalink?: string;
}
