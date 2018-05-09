import * as moment from 'moment';
import { DataTypeInteger, DataTypeString, DataTypeUUID, default as Sequelize } from 'sequelize';

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

export interface Model<TI, TA> extends Sequelize.Model<TI, TA> {
    readonly name: string;
    associate?(db: {[key: string]: Sequelize.Model<TI, TA>}): void;
}

export interface ModelMap {
    [key: string]: Model<any, any>;
}

export interface DB {
    readonly sequelize: Sequelize.Sequelize;
    importModels: (seq: Sequelize.Sequelize) => ModelMap;
    readonly models: ModelMap;
}

export interface CalendarAttributes {
    readonly id?: string;
    readonly name: string;
    readonly dateTime: Date | string;
    readonly timezone: string;
    readonly location: string;
    readonly type: string;
    readonly website: string;
    readonly collaborators?: CollaboratorInstance[];
    readonly pieces?: PieceInstance[];
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface CalendarInstance extends Sequelize.Instance<CalendarAttributes>, CalendarAttributes {
    getPieces: Sequelize.BelongsToManyGetAssociationsMixin<PieceInstance>;
    setPieces: Sequelize.BelongsToManySetAssociationsMixin<PieceInstance, PieceAttributes['id'], CalendarPieceAttributes>;
    addPiece: Sequelize.BelongsToManyAddAssociationMixin<PieceInstance, PieceAttributes['id'], CalendarPieceAttributes>;
    addPieces: Sequelize.BelongsToManyAddAssociationsMixin<PieceInstance, PieceAttributes['id'], CalendarPieceAttributes>;
    removePiece: Sequelize.BelongsToManyRemoveAssociationMixin<PieceInstance, PieceAttributes['id']>;
    removePieces: Sequelize.BelongsToManyRemoveAssociationsMixin<PieceInstance, PieceAttributes['id']>;
    countPieces: Sequelize.BelongsToManyCountAssociationsMixin;

    getCollaborators: Sequelize.BelongsToManyGetAssociationsMixin<CollaboratorInstance>;
    setCollaborators: Sequelize.BelongsToManySetAssociationsMixin<CollaboratorInstance, CollaboratorAttributes['id'], CalendarCollaboratorAttributes>;
    addCollaborator: Sequelize.BelongsToManyAddAssociationMixin<CollaboratorInstance, CollaboratorAttributes['id'], CalendarCollaboratorAttributes>;
    addCollaborators: Sequelize.BelongsToManyAddAssociationsMixin<CollaboratorInstance, CollaboratorAttributes['id'], CalendarCollaboratorAttributes>;
    removeCollaborator: Sequelize.BelongsToManyRemoveAssociationMixin<CollaboratorInstance, CollaboratorAttributes['id']>;
    removeCollaborators: Sequelize.BelongsToManyRemoveAssociationsMixin<CollaboratorInstance, CollaboratorAttributes['id']>;
    countCollaborators: Sequelize.BelongsToManyCountAssociationsMixin;
}

export interface CalendarModel extends Model<CalendarInstance, CalendarAttributes> {}

export interface AcclaimAttributes {
    readonly id?: DataTypeUUID;
    readonly quote: string;
    readonly short: string;
    readonly author: string;
    readonly shortAuthor: string;
    readonly date: string;
}

export interface AcclaimInstance extends Sequelize.Instance<AcclaimAttributes>, AcclaimAttributes {}

export interface AcclaimModel extends Model<AcclaimAttributes, AcclaimInstance> {}

export interface MusicFileAttributes {
    readonly id?: DataTypeUUID;
    readonly name: string;
    readonly audioFile: string;
    readonly waveformFile: string;
    readonly durationSeconds: number;
    readonly musicId?: DataTypeUUID;
    readonly hash?: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface MusicFileInstance extends Sequelize.Instance<MusicFileAttributes>, MusicFileAttributes {
    readonly getMusics: Sequelize.BelongsToGetAssociationMixin<MusicInstance>;
    readonly setMusics: Sequelize.BelongsToSetAssociationMixin<MusicInstance, MusicAttributes['id']>;
    readonly music: MusicInstance;
}

export interface MusicFileModel extends Model<MusicFileInstance, MusicFileAttributes> {}

export interface MusicAttributes {
    readonly id: DataTypeUUID;
    readonly composer: string;
    readonly piece: string;
    readonly contributors: string;
    readonly type: string;
    readonly musicFiles: MusicFileAttributes[];
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

interface HasManyGetAssociationsMixin<T, U> extends Sequelize.HasManyGetAssociationsMixin<T> {
    (options?: Sequelize.HasManyGetAssociationsMixinOptions | Sequelize.FindOptions<U>): Promise<T[]>;
}

export interface MusicInstance extends Sequelize.Instance<MusicAttributes>, MusicAttributes {
    readonly getMusicFiles: HasManyGetAssociationsMixin<MusicFileInstance, MusicFileAttributes>;
    readonly setMusicFiles: Sequelize.HasManySetAssociationsMixin<MusicFileInstance, MusicFileAttributes['id']>;
}

export interface MusicModel extends Model<MusicInstance, MusicAttributes> {
    readonly musicFile: MusicFileModel;
}

export interface CollaboratorAttributes {
    readonly id: DataTypeUUID;
    readonly name: string;
    readonly instrument: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface CollaboratorInstance extends Sequelize.Instance<CollaboratorAttributes>, CollaboratorAttributes {
    countCalendars: Sequelize.BelongsToManyCountAssociationsMixin;
}

export interface CollaboratorModel extends Model<CollaboratorInstance, CollaboratorAttributes> {}

export interface PieceAttributes {
    readonly id: DataTypeUUID;
    readonly composer: string;
    readonly piece: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface PieceInstance extends Sequelize.Instance<PieceAttributes>, PieceAttributes {
    countCalendars: Sequelize.BelongsToManyCountAssociationsMixin;
}

export interface PieceModel extends Model<PieceInstance, PieceAttributes> {}

export interface CalendarPieceAttributes {
    readonly id?: DataTypeUUID;
    readonly calendarId?: DataTypeString;
    readonly programId?: DataTypeUUID;
    readonly order?: number;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface CalendarPieceInstance extends Sequelize.Instance<CalendarPieceAttributes>, CalendarPieceAttributes {}

export interface CalendarPieceModel extends Model<CalendarPieceInstance, CalendarPieceAttributes> {}

export interface CalendarCollaboratorAttributes {
    readonly id?: DataTypeUUID;
    readonly calendarId?: DataTypeString;
    readonly collaboratorId?: DataTypeUUID;
    readonly order?: number;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface CalendarCollaboratorInstance extends Sequelize.Instance<CalendarCollaboratorAttributes>, CalendarCollaboratorAttributes {}

export interface CalendarCollaboratorModel extends Model<CalendarCollaboratorInstance, CalendarCollaboratorAttributes> {}

export interface PhotoAttributes {
    readonly id?: DataTypeUUID;
    readonly file: DataTypeString;
    readonly credit: DataTypeString;
    readonly width: DataTypeInteger;
    readonly height: DataTypeInteger;
    readonly thumbnailWidth: DataTypeInteger;
    readonly thumbnailHeight: DataTypeInteger;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface PhotoInstance extends Sequelize.Instance<PhotoAttributes>, PhotoAttributes {}

export interface PhotoModel extends Model<PhotoInstance, PhotoAttributes> {}

export interface TokenAttributes {
    readonly id: string;
    readonly token: string;
    readonly expires: Date | string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface TokenInstance extends Sequelize.Instance<TokenAttributes>, TokenAttributes {}

export interface TokenModel extends Model<TokenInstance, TokenAttributes> {}
