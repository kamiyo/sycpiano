"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CalendarSyncToken = (sequelize, dataTypes) => sequelize.define('calendarSyncToken', {
    id: {
        type: dataTypes.UUID,
        defaultValue: dataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    token: dataTypes.STRING,
}, { tableName: 'calendar_sync_token' });
exports.default = CalendarSyncToken;
