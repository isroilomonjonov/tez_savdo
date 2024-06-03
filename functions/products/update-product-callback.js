const { languages } = require("../../utils/Languages");

exports.updateProductCallbackFn = async (
  bot,
  callbackQuery,
  chatId,
  messagetwo,
  userStates,
  user
) => {
  const productId = callbackQuery.data.split("_")[1];
  await bot.editMessageText("Yangilash uchun mahsulot tanlandi!", {
    chat_id: chatId,
    message_id: messagetwo.message_id,
  });
  await bot.sendMessage(callbackQuery.from.id, "Mahsulot nomini kiriting:", {
    reply_markup: {
      keyboard: [["\u{1F3E0}" + languages[user?.lang]?.index?.goMainMenu]],
      resize_keyboard: true,
    },
  });
  userStates[callbackQuery.from.id] = {
    command: "update",
    step: "name",
    id: productId,
  };
};
