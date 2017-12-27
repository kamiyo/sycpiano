import { Sequelize, DataTypes } from "sequelize";
import { MusicFileModel } from "types";

const MusicFile = (sequelize: Sequelize, DataTypes: DataTypes) => (
    sequelize.define('musicFile', {
        id: {
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            type: DataTypes.UUID,
            unique: true,
        },
        name: DataTypes.STRING,
        filePath: DataTypes.STRING,
        pathToWaveform: DataTypes.STRING,
        durationSeconds: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }) as MusicFileModel
);

export default MusicFile;
