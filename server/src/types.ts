import { DataTypeInteger, DataTypeString, DataTypeUUID, default as Sequelize } from 'sequelize';

export interface Model<TI, TA> extends Sequelize.Model<TI, TA> {
    name: string;
    associate?(db: {[key: string]: Sequelize.Model<TI, TA>}): void;
}

export interface ModelMap {
    [key: string]: Model<any, any>;
}

export interface DB {
    sequelize: Sequelize.Sequelize;
    importModels: (seq: Sequelize.Sequelize) => ModelMap;
    models: ModelMap;
}

export interface CalendarAttributes {
    id?: string;
    name: string;
    dateTime: Date | string;
    timezone: string;
    location: string;
    type: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
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
    id?: DataTypeUUID;
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
    musicId?: DataTypeUUID;
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

export interface CollaboratorAttributes {
    id: DataTypeUUID;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface CollaboratorInstance extends Sequelize.Instance<CollaboratorAttributes>, CollaboratorAttributes {}

export interface CollaboratorModel extends Model<CollaboratorInstance, CollaboratorAttributes> {}

export interface PieceAttributes {
    id: DataTypeUUID;
    piece: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface PieceInstance extends Sequelize.Instance<PieceAttributes>, PieceAttributes {}

export interface PieceModel extends Model<PieceInstance, PieceAttributes> {}

export interface CalendarPieceAttributes {
    id: DataTypeUUID;
    calendarId: DataTypeString;
    programId: DataTypeUUID;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface CalendarPieceInstance extends Sequelize.Instance<CalendarPieceAttributes>, CalendarPieceAttributes {}

export interface CalendarPieceModel extends Model<CalendarPieceInstance, CalendarPieceAttributes> {}

export interface CalendarCollaboratorAttributes {
    id: DataTypeUUID;
    calendarId: DataTypeString;
    collaboratorId: DataTypeUUID;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface CalendarCollaboratorInstance extends Sequelize.Instance<CalendarCollaboratorAttributes>, CalendarCollaboratorAttributes {}

export interface CalendarCollaboratorModel extends Model<CalendarCollaboratorInstance, CalendarCollaboratorAttributes> {}

export interface PhotoAttributes {
    id?: DataTypeUUID;
    file: DataTypeString;
    width: DataTypeInteger;
    height: DataTypeInteger;
    thumbnailWidth: DataTypeInteger;
    thumbnailHeight: DataTypeInteger;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface PhotoInstance extends Sequelize.Instance<PhotoAttributes>, PhotoAttributes {}

export interface PhotoModel extends Model<PhotoInstance, PhotoAttributes> {}