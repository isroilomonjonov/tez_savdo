const Products = require("../../models/products");
const { languages } = require("../../utils/Languages");
const formatter = new Intl.NumberFormat("uz-UZ", {
  style: "currency",
  currency: "UZS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
exports.productByNameFn = async (bot, msg, chatId, carts, user) => {
  const product = await Products.findOne({
    where: { title: msg.text },
  });
  const productByCart = carts[chatId]?.find((p) => p.id == product?.id);
  if (productByCart) {
    const productMessage = `*${product.title}*\n${
      product.description
    }\n\n* Narxi | Цена: ${formatter.format(Number(product.price))}*`;
    if (product.image) {
      const inlineKeyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "❌" + languages[user.lang].index.clearCart,
                callback_data: `remove_${product.id}`,
              },
            ],
            [
              { text: "➖", callback_data: `decrease_${product.id}` },
              {
                text: `${
                  carts[chatId]?.find((p) => p.id == product.id)?.quantity
                }`,
                callback_data: "ignore",
              },
              { text: "➕", callback_data: `increase_${product.id}` },
            ],
          ],
        },
      };
      await bot.sendPhoto(chatId, product.image);
      await bot.sendMessage(chatId, productMessage, {
        ...inlineKeyboard,
        parse_mode: "Markdown",
      });
    } else {
      bot.sendMessage(chatId, productMessage, {
        parse_mode: "Markdown",
      });
    }
  } else {
    if (product) {
      const productMessage = `*${product.title}*\n${
        product.description
      }\n\n* Narxi | Цена: ${formatter.format(Number(product.price))}*`;
      if (product.image) {
        const inlineKeyboard = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Sotib olish | Купить",
                  callback_data: `buy_${product.id}`,
                },
              ],
            ],
          },
        };
        await bot.sendPhoto(chatId, product.image);
        await bot.sendMessage(chatId, productMessage, {
          ...inlineKeyboard,
          parse_mode: "Markdown",
        });
      } else {
        bot.sendMessage(chatId, productMessage, {
          parse_mode: "Markdown",
        });
      }
    }
  }
};
