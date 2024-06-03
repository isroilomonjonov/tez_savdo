const { languages } = require("../../utils/Languages");

exports.decreaseProduct = async (bot, callbackQuery, chatId, carts, user) => {
  const productId = callbackQuery.data.split("_")[1];
  const product = carts[chatId]?.find((p) => p.id == productId);
  const messageId = callbackQuery.message.message_id;
  if (product.quantity === 1) {
    carts[chatId] = carts[chatId].filter((i) => i.id != productId);
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
    const opts = {
      chat_id: chatId,
      message_id: messageId,
      ...inlineKeyboard,
    };
    await bot.editMessageReplyMarkup(opts.reply_markup, opts);
  } else {
    product.quantity--;
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
  }
};
