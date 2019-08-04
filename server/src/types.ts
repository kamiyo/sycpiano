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

export class Model<T = any, T2 = any> extends Sequelize.Model<T, T2> {
    static associate?(db: { [key: string]: ModelCtor<any> }): void;
}

export type ModelCtor<M extends Model> = (new () => M) & typeof Model;

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
    [key: string]: typeof Model;
}

export interface DB {
    readonly sequelize: Sequelize.Sequelize;
    importModels: (seq: Sequelize.Sequelize) => ModelMap;
    readonly models: ModelMap;
}

export interface ShopItem {
    readonly caption: string;
    readonly created: number;
    readonly description: string;
    readonly productId: string;
    readonly skuId: string;
    readonly image: string;
    readonly name: string;
    readonly updated: number;
    readonly price: number;
}

export interface OrderItem {
    readonly amount: number;
    readonly quantity?: number;
    readonly type: 'sku' | 'tax' | 'shipping' | 'discount';
    readonly parent?: string;
}

export interface Order {
    readonly id: string;
    readonly amount: number;
    readonly items: OrderItem[];
    readonly productId: string;
    readonly images: string[];
    readonly name: string;
    readonly updated: number;
    // Usually, a product will potentially have multiple SKUs,
    // but in our case, each item in the store will only have one SKU
    // with infinite stock, since they're just PDFs.
    readonly skuId: string;
}
