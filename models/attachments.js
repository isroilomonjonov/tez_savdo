const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Attachments = sequelize.define(
  "attachments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    file_id: {
      type: DataTypes.TEXT,
    },
    file_unique_id: {
      type: DataTypes.TEXT,
    },
    file_size: {
      type: DataTypes.INTEGER,
    },
    width: {
      type: DataTypes.INTEGER,
    },
    height: {
      type: DataTypes.INTEGER,
    },
  },
  { underscored: true }
);
module.exports = Attachments;
