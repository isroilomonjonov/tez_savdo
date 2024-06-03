const { getById } = require("../../controllers/usersController");
const { languages } = require("../../utils/Languages");

exports.createProductFn = async (bot, msg, userStates) => {
  const chatId = msg.chat.id;
  const user = await getById(chatId);
  if (user.id === process.env.ADMIN) {
    await bot.sendMessage(chatId, "Mahsulot nomini kiriting:", {
      reply_markup: {
        keyboard: [["\u{1F3E0}" + languages[user?.lang]?.index?.goMainMenu]],
        resize_keyboard: true,
      },
    });
    userStates[chatId] = { step: "name" };
  } else {
    bot.sendMessage(chatId, "Sizda bu komandani ishlatish uchun huquq yo‘q.");
  }
};
