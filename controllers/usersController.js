const { Op } = require("sequelize");
const Users = require("../models/users");

exports.getAllUser = async () => {
  let allUser = await Users.findAndCountAll();
  return allUser;
};

exports.getById = async (id) => {
  const byId = await Users.findByPk(id);
  return byId;
};
exports.createUser = async (chat) => {
  try {
    const user = await Users.create(chat);
    return user;
  } catch (error) {
    console.log(error);
  }
};
exports.changeUserOrderStatus = async (chatId, status) => {
  try {
    const byId = await Users.findByPk(chatId);
    const user = await byId.update({ order_creating: status });
    console.log("User statusi o'zgardi " + status);
    return user;
  } catch (error) {
    console.log(error);
  }
};
exports.updateUser = async (chat) => {
  console.log(chat);
  try {
    const byId = await Users.findByPk(chat.id);
    const user = await byId.update(chat);
    console.log(user, "updated");
    return user;
  } catch (error) {
    console.log(error);
  }
};
