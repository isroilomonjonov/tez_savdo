const {
  getById,
  updateUser,
  createUser,
} = require("../controllers/usersController");
const { languages } = require("../utils/Languages");
const { mainKeyboard, mainKeyboardFn } = require("../utils/MainKeyboard");

exports.languageCallbackQueryFn = async (bot, callbackQuery) => {
  try {
    const chatId = callbackQuery.message.chat.id;
    const language = callbackQuery.data;
    const messagetwo = callbackQuery.message;
    const langMessage = languages[language].index.afterSelectLanguage;

    // Tilni sozlash
    let message = "";
    if (language === "ru") {
      message = "Вы выбрали русский язык.";
    } else if (language === "uz") {
      message = "O‘zbek tilini tanladingiz.";
    } else {
      message = "Til tanlashda xatolik.";
    }
    const user = await getById(callbackQuery.message.chat.id);
    let newUser;
    if (user) {
      newUser = await updateUser({
        ...callbackQuery.message.chat,
        lang: language,
      });
    } else {
      newUser = await createUser({
        ...callbackQuery.message.chat,
        lang: language,
      });
    }
    //   bot.sendMessage(
    //     process.env.CHANNEL_ID,
    //     `Yangi user ro'yhatdan o'tdi Ismi: ${newUser.first_name} ${newUser.last_name} @${newUser.username} ${newUser.phoneNumber} tili: ${newUser.lang}`
    //   );
    bot.editMessageText(langMessage, {
      chat_id: chatId,
      message_id: messagetwo.message_id,
    });

    if (user || newUser) {
      if (!user?.phoneNumber && !newUser?.phoneNumber) {
        bot.sendMessage(
          chatId,
          languages[language].index.pleaseSelectNumberMSG,
          {
            reply_markup: {
              keyboard: [
                [
                  {
                    text: languages[language].index.phoneSelectKeyboardText,
                    request_contact: true,
                  },
                ],
              ],
              resize_keyboard: true,
            },
          }
        );
      } else {
        bot.sendMessage(
          chatId,
          languages[newUser?.lang]?.index?.afterChangeLanguage,
          {
            reply_markup: mainKeyboardFn(newUser),
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};
