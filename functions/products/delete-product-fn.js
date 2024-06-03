const { getAllProducts } = require("../../controllers/products");

exports.deleteProductFn = async (bot, msg) => {
  const chatId = msg.chat.id;
  const products = await getAllProducts();
  if (products?.rows?.length === 0) {
    return bot.sendMessage(chatId, "Mahsulotlar mavjud emas.");
  }
  if (chatId.toString() === process.env.ADMIN) {
    const productButtons = products.rows.map((product) => {
      return [
        {
          text: product.title,
          callback_data: `deleteproduct_${product.id}`,
        },
      ];
    });
    bot.sendMessage(
      chatId,
      "Mahsultoni tanlagan holda o'chirishingiz mumkin!",
      {
        reply_markup: {
          inline_keyboard: productButtons,
          resize_keyboard: true,
          one_time_keyboard: false,
        },
      }
    );
  } else {
    bot.sendMessage(chatId, "Sizda bu komandani ishlatish uchun huquq yo‘q.");
  }
};
