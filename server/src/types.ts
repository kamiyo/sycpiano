import { DataTypeInteger, DataTypeString, DataTypeUUID, default as Sequelize } from 'sequelize';

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
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface CalendarInstance extends Sequelize.Instance<CalendarAttributes>, CalendarAttributes {
    getPieces: Sequelize.BelongsToManyGetAssociationsMixin<PieceInstance>;
    setPieces: Sequelize.BelongsToManySetAssociationsMixin<PieceInstance, PieceAttributes['id'], CalendarPieceAttributes>;
    addPiece: Sequelize.BelongsToManyAddAssociationMixin<PieceInstance, PieceAttributes['id'], CalendarPieceAttributes>;
    addPieces: Sequelize.BelongsToManyAddAssociationsMixin<PieceInstance, PieceAttributes['id'], CalendarPieceAttributes>;

    getCollaborators: Sequelize.BelongsToManyGetAssociationsMixin<CollaboratorInstance>;
    setCollaborators: Sequelize.BelongsToManySetAssociationsMixin<CollaboratorInstance, CollaboratorAttributes['id'], CalendarCollaboratorAttributes>;
    addCollaborator: Sequelize.BelongsToManyAddAssociationMixin<CollaboratorInstance, CollaboratorAttributes['id'], CalendarCollaboratorAttributes>;
    addCollaborators: Sequelize.BelongsToManyAddAssociationsMixin<CollaboratorInstance, CollaboratorAttributes['id'], CalendarCollaboratorAttributes>;
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
    readonly filePath: string;
    readonly pathToWaveform: string;
    readonly durationSeconds: number;
    readonly musicId?: DataTypeUUID;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface MusicFileInstance extends Sequelize.Instance<MusicFileAttributes>, MusicFileAttributes {}

export interface MusicFileModel extends Model<MusicFileInstance, MusicFileAttributes> {}

export interface MusicAttributes {
    readonly id: DataTypeUUID;
    readonly composer: string;
    readonly piece: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface MusicInstance extends Sequelize.Instance<MusicAttributes>, MusicAttributes {}

export interface MusicModel extends Model<MusicInstance, MusicAttributes> {}

export interface CollaboratorAttributes {
    readonly id: DataTypeUUID;
    readonly name: string;
    readonly instrument: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface CollaboratorInstance extends Sequelize.Instance<CollaboratorAttributes>, CollaboratorAttributes {}

export interface CollaboratorModel extends Model<CollaboratorInstance, CollaboratorAttributes> {}

export interface PieceAttributes {
    readonly id: DataTypeUUID;
    readonly piece: string;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface PieceInstance extends Sequelize.Instance<PieceAttributes>, PieceAttributes {}

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
    readonly width: DataTypeInteger;
    readonly height: DataTypeInteger;
    readonly thumbnailWidth: DataTypeInteger;
    readonly thumbnailHeight: DataTypeInteger;
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;
}

export interface PhotoInstance extends Sequelize.Instance<PhotoAttributes>, PhotoAttributes {}

export interface PhotoModel extends Model<PhotoInstance, PhotoAttributes> {}
