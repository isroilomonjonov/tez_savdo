const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Users = require("./users");
const OrderItems = require("./orderItems");

const Orders = sequelize.define(
  "orders",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    totalPrice: {
      type: DataTypes.BIGINT,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "completed", "canceled"],
      defaultValue: "pending",
    },
  },
  { underscored: true }
);
module.exports = Orders;
