import { DataTypeUUID, default as Sequelize } from 'sequelize';

export interface Model<TI, TA> extends Sequelize.Model<TI, TA> {
    name: string;
    associate?(db: {[key: string]: Sequelize.Model<TI, TA>}): void;
}

export interface ModelMap {
    [name: string]: Model<any, any>;
}

export interface CalendarAttributes {
    id: string;
    name: string;
    dateTime: Date | string;
    timezone: string;
    location: string;
    collaborators: string[];
    type: {
        label: string;
        value: string;
    };
    program: string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface CalendarInstance extends Sequelize.Instance<CalendarAttributes>, CalendarAttributes {}

export interface CalendarModel extends Model<CalendarInstance, CalendarAttributes> {}

export interface AcclaimAttributes {
    id?: number;
    quote: string;
    short: string;
    author: string;
    shortAuthor: string;
    date: string;
}

export interface AcclaimInstance extends Sequelize.Instance<AcclaimAttributes>, AcclaimAttributes {}

export interface AcclaimModel extends Model<AcclaimAttributes, AcclaimInstance> {}

export interface MusicFileAttributes {
    id?: DataTypeUUID;
    name: string;
    filePath: string;
    pathToWaveform: string;
    durationSeconds: number;
    music_id?: DataTypeUUID;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface MusicFileInstance extends Sequelize.Instance<MusicFileAttributes>, MusicFileAttributes {}

export interface MusicFileModel extends Model<MusicFileInstance, MusicFileAttributes> {}

export interface MusicAttributes {
    id: DataTypeUUID;
    composer: string;
    piece: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface MusicInstance extends Sequelize.Instance<MusicAttributes>, MusicAttributes {}

export interface MusicModel extends Model<MusicInstance, MusicAttributes> {}
