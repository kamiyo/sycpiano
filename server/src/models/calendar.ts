import * as moment from 'moment';
import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    DataTypes,
    Sequelize,
} from 'sequelize';

import { createCalendarEvent, deleteCalendarEvent, getLatLng, getTimeZone, updateCalendar } from '../gapi/calendar';
import { Model } from '../types';
import { collaborator } from './collaborator';
import { piece } from './piece';

export class calendar extends Model {
    id?: string;
    name: string;
    dateTime: Date;
    allDay: boolean;
    endDate: Date;
    timezone: string;
    location: string;
    type: string;
    website: string;
    readonly collaborators?: collaborator[];
    readonly pieces?: piece[];
    readonly createdAt?: Date | string;
    readonly updatedAt?: Date | string;

    getPieces: BelongsToManyGetAssociationsMixin<piece>;
    setPieces: BelongsToManySetAssociationsMixin<piece, piece['id']>;
    addPiece: BelongsToManyAddAssociationMixin<piece, piece['id']>;
    addPieces: BelongsToManyAddAssociationsMixin<piece, piece['id']>;
    removePiece: BelongsToManyRemoveAssociationMixin<piece, piece['id']>;
    removePieces: BelongsToManyRemoveAssociationsMixin<piece, piece['id']>;
    countPieces: BelongsToManyCountAssociationsMixin;

    getCollaborators: BelongsToManyGetAssociationsMixin<collaborator>;
    setCollaborators: BelongsToManySetAssociationsMixin<collaborator, collaborator['id']>;
    addCollaborator: BelongsToManyAddAssociationMixin<collaborator, collaborator['id']>;
    addCollaborators: BelongsToManyAddAssociationsMixin<collaborator, collaborator['id']>;
    removeCollaborator: BelongsToManyRemoveAssociationMixin<collaborator, collaborator['id']>;
    removeCollaborators: BelongsToManyRemoveAssociationsMixin<collaborator, collaborator['id']>;
    countCollaborators: BelongsToManyCountAssociationsMixin;
}

const beforeCreateHook = async (c: calendar, _: any) => {
    console.log(`[Calendar Hook beforeCreate]`);
    const {
        location,
        dateTime,
        allDay,
        endDate,
        name,
        type,
        website,
    } = c;

    console.log(`Fetching coord and tz.`);
    let timezone = null;
    if (location) {
        const { latlng } = await getLatLng(location);
        timezone = await getTimeZone(latlng.lat, latlng.lng, dateTime);
    }
    console.log(`Done fetching.`);
    const description = JSON.stringify({
        collaborators: [],
        pieces: [],
        type,
        website: encodeURI(website) || '',
    });

    const dateString = moment(c.dateTime).format('YYYY-MM-DD HH:mm');
    const dateWithTz = moment.tz(dateString, timezone).toDate();

    if (allDay) {
        const endDateString = moment(c.endDate).format('YYYY-MM-DD');
        const endDateWithTz = moment.tz(endDateString, timezone).toDate();
        c.endDate = endDateWithTz;
    }

    console.log(`Creating google calendar event '${name}' on ${dateTime}.\n`);
    const createResponse = await createCalendarEvent(c.sequelize, {
        summary: name,
        description,
        location,
        startDatetime: dateWithTz,
        endDate,
        allDay,
        timeZone: timezone,
    });

    const id = createResponse.data.id;
    console.log(`Received response id: ${id}.`);

    c.id = id;
    c.location = location;
    c.timezone = timezone;
    c.dateTime = dateWithTz;
    console.log(`[End Hook]\n`);
};

const beforeUpdateHook = async (c: calendar, _: any) => {
    console.log(`[Calendar Hook afterUpdate]`);
    console.log(`Fetching coord and tz.`);
    let timezone = null;
    const location = c.location;
    if (location) {
        const { latlng } = await getLatLng(location);
        timezone = await getTimeZone(latlng.lat, latlng.lng, c.dateTime);
    }
    const dateString = moment(c.dateTime).format('YYYY-MM-DD HH:mm');
    const dateWithTz = moment.tz(dateString, timezone).toDate();
    c.dateTime = dateWithTz;
    c.timezone = timezone;

    const collaborators = await c.getCollaborators();
    const pieces = await c.getPieces();
    const data = {
        id: c.id,
        summary: c.name,
        location: c.location,
        startDatetime: dateWithTz,
        endDate: c.endDate,
        allDay: c.allDay,
        timeZone: timezone,
        description: JSON.stringify({
            collaborators: collaborators.map((collab) => ({
                name: collab.name,
                instrument: collab.instrument,
            })),
            pieces: pieces.map((pie) => ({
                composer: pie.composer,
                piece: pie.piece,
            })),
            type: c.type,
            website: c.website,
        }),
    };
    console.log(`Updating google calendar event: ${c.id}.`);
    await updateCalendar(c.sequelize, data);
    console.log(`[End Hook]\n`);
};

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    calendar.init({
        id: {
            autoIncrement: false,
            primaryKey: true,
            type: dataTypes.STRING,
            unique: true,
        },
        name: dataTypes.STRING,
        dateTime: {
            type: dataTypes.DATE,
            field: 'date_time',
        },
        allDay: {
            type: dataTypes.BOOLEAN,
            field: 'all_day',
        },
        endDate: {
            type: dataTypes.DATEONLY,
            field: 'end_date',
        },
        timezone: dataTypes.STRING,
        location: dataTypes.STRING,
        type: dataTypes.STRING,
        website: dataTypes.STRING,
    }, {
            hooks: {
                beforeCreate: beforeCreateHook,
                afterDestroy: async (c: calendar, _: any) => {
                    console.log(`[Calendar Hook afterDestroy]`);
                    await deleteCalendarEvent(c.sequelize, c.id);
                    console.log(`[End Hook]\n`);
                },
                beforeUpdate: beforeUpdateHook,
            },
            sequelize,
            tableName: 'calendar',
        });

    calendar.associate = (models) => {
        calendar.hasMany(models.calendarPiece);
        calendar.hasMany(models.calendarCollaborator);
        calendar.belongsToMany(models.piece, { through: models.calendarPiece });
        calendar.belongsToMany(models.collaborator, { through: models.calendarCollaborator });
    };

    return calendar;
};
