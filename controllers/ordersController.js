const { Op, where } = require("sequelize");
const Orders = require("../models/orders");
const Users = require("../models/users");
const OrderItems = require("../models/orderItems");
const Products = require("../models/products");

exports.getAllOrders = async () => {
  let allOrders = await Orders.findAndCountAll();
  return allOrders;
};
exports.findNotCompletedOrderByUserId = async (chatId) => {
  try {
    let order = await Orders.findOne({
      where: { userId: chatId, completed: false },
      include: [{ model: Users }],
    });
    return order;
  } catch (error) {
    console.log(error);
  }
};
exports.deleteAllInCompletedOrders = async (chatId) => {
  try {
    let order = await Orders.findOne({
      where: { userId: chatId, completed: false },
    });
    await order.destroy();
  } catch (error) {
    console.log(error);
  }
};
exports.getOrderById = async (id) => {
  const byId = await Orders.findOne({
    where: { id: id },
    include: [
      { model: Users },
      { model: OrderItems, include: [{ model: Products }] },
    ],
  });
  return byId;
};
exports.createOrder = async (data, userId, items) => {
  console.log(data);
  try {
    let newOrder;
    if (items?.length > 0) {
      newOrder = await Orders.create({
        status: "completed",
        userId,
        ...data,
      });
    }
    const itemArr = [];

    items?.forEach((item) => {
      return itemArr.push({
        subtotal: item.price * item.quantity,
        quantity: item.quantity,
        productId: item.id,
        orderId: newOrder.id,
      });
    });
    await OrderItems.bulkCreate(itemArr);
    const totalMoney = await OrderItems.sum("subtotal", {
      where: { orderId: { [Op.eq]: newOrder.id } },
    });

    await newOrder.update({ totalPrice: totalMoney });
    return newOrder;
  } catch (error) {
    console.log(error);
  }
};
exports.updateOrder = async (id, data) => {
  try {
    const byId = await Orders.findByPk(id);
    const order = await byId.update(data);
    return order;
  } catch (error) {
    console.log(error);
  }
};
