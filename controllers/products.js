const { Op } = require("sequelize");
const Products = require("../models/products");

exports.getAllProducts = async () => {
  let allProducts = await Products.findAndCountAll();
  return allProducts;
};

exports.getByIdProduct = async (id) => {
  const byId = await Products.findByPk(id);
  return byId;
};
exports.createProduct = async (data) => {
  try {
    const product = await Products.create(data);
    return product;
  } catch (error) {
    console.log(error);
  }
};
exports.updateProduct = async (id, data) => {
  try {
    const byId = await Products.findByPk(id);
    const product = await byId.update(data);
    return product;
  } catch (error) {
    console.log(error);
  }
};
exports.deleteProduct = async (id) => {
  try {
    const byId = await Products.findByPk(id);
    await byId.destroy();
  } catch (error) {
    console.log(error);
  }
};
