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

export type ModelCtor<M extends Model> = (new () => M) & typeof Sequelize.Model;

export class Model<T = any, T2 = any> extends Sequelize.Model<T, T2> {
    static associate?(db: {[key: string]: ModelCtor<any>}): void;
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
    [key: string]: typeof Model;
}

export interface DB {
    readonly sequelize: Sequelize.Sequelize;
    importModels: (seq: Sequelize.Sequelize) => ModelMap;
    readonly models: ModelMap;
}

export interface StoreItem {
    readonly caption: string;
    readonly created: number;
    readonly description: string;
    readonly id: string;
    readonly images: string[];
    readonly name: string;
    readonly updated: number;
}
