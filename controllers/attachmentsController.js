const { Op } = require("sequelize");
const Attachments = require("../models/attachments");

exports.getAllAttachments = async () => {
  let allAttachments = await Attachments.findAndCountAll();
  return allAttachments;
};

exports.getByIdAttachments = async (id) => {
  const byId = await Attachments.findAll({ where: { orderId: id } });
  return byId;
};
exports.createAttachment = async (data) => {
  console.log(data);
  try {
    const attachment = await Attachments.create(data);
    return attachment;
  } catch (error) {
    console.log(error);
  }
};
