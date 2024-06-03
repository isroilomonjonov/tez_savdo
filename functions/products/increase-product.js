const { languages } = require("../../utils/Languages");

exports.increaseProduct = async (bot, callbackQuery, chatId, carts, user) => {
  const productId = callbackQuery.data.split("_")[1];
  const product = carts[chatId]?.find((p) => p.id == productId);
  product && product.quantity++;
  const messageId = callbackQuery.message.message_id;
  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "❌" + languages[user.lang].index.clearCart,
            callback_data: `remove_${product?.id}`,
          },
        ],
        [
          { text: "➖", callback_data: `decrease_${product?.id}` },
          {
            text: `${carts[chatId]?.find((p) => p.id == productId).quantity}`,
            callback_data: "ignore",
          },
          { text: "➕", callback_data: `increase_${product?.id}` },
        ],
      ],
    },
  };
  const opts = {
    chat_id: chatId,
    message_id: messageId,
    ...inlineKeyboard,
  };
  await bot.editMessageReplyMarkup(opts.reply_markup, opts);
  console.log(carts);
};
