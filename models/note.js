const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Note = sequelize.define(
    "Note",
    {
      noteId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      placeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Place",
          key: "placeId",
          onDelete: "CASCADE",
        },
      },
      direction: {
        type: DataTypes.STRING,
        defaultValue: false,
        allowNull: true,
      },
      parking: {
        type: DataTypes.STRING,
        defaultValue: false,
        allowNull: true,
      },
      smoking: {
        type: DataTypes.STRING,
        defaultValue: false,
        allowNull: true,
      },
      stringingService: {
        type: DataTypes.STRING,
        defaultValue: false,
        allowNull: true,
      },
      etc: {
        type: DataTypes.STRING,
        defaultValue: false,
        allowNull: true,
      },
    },
    {
      tableName: "Note",
      timestamps: false,
    }
  );

  return Note;
};
