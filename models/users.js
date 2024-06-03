const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Orders = require("./orders");
const Attachments = require("./attachments");
const OrderItems = require("./orderItems");
const Users = sequelize.define(
  "users",
  {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    lang: {
      type: DataTypes.STRING,
    },
  },
  {
    underscored: true,
  }
);
Users.hasMany(Orders);
Orders.belongsTo(Users);
Orders.hasMany(OrderItems);
OrderItems.belongsTo(Orders);
module.exports = Users;
