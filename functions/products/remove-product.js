exports.removeProduct = async (bot, callbackQuery, chatId, carts) => {
  const productId = callbackQuery.data.split("_")[1];
  const product = carts[chatId]?.find((p) => p.id == productId);
  const messageId = callbackQuery.message.message_id;
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
};
