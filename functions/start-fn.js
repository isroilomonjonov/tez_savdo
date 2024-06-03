const { getById } = require("../controllers/usersController");
const { languageKeyboard } = require("../utils/LanguageKeyborad");
const { languages } = require("../utils/Languages");
const { mainKeyboardFn } = require("../utils/MainKeyboard");
const { detectLanguage } = require("./detect-language");

exports.startFn = async (bot, msg) => {
  try {
    const chatId = msg.chat.id;
    console.log(msg);
    const user = await getById(msg.from.id);
    console.log(user);
    const lang = detectLanguage(msg); // Implement language detection logic
    let message = languages[lang].index.start;
    if (!user) {
      bot.sendMessage(
        chatId,
        `Assalom alekum ALIMax - Tashkent telegram botiga hush kelibsiz!\n\n\nПривет и добро пожаловать в бот ALIMax - Tashkent!\n\nTilni tanlang! | Выберите язык!`,
        { reply_markup: languageKeyboard }
      );
    } else {
      if (!user.phoneNumber) {
        bot.sendMessage(
          chatId,
          languages[user.lang].index.pleaseSelectNumberMSG,
          {
            reply_markup: {
              keyboard: [
                [
                  {
                    text: languages[user.lang].index.phoneSelectKeyboardText,
                    request_contact: true,
                  },
                ],
              ],
              resize_keyboard: true,
            },
          }
        );
      } else if (!user.lang) {
        bot.sendMessage(
          chatId,
          `Assalom alekum ALIMax - Tashkent telegram botiga hush kelibsiz!\n\n\nПривет и добро пожаловать в бот ALIMax - Tashkent!\n\nTilni tanlang! | Выберите язык!`,
          { reply_markup: languageKeyboard }
        );
      } else {
        message = languages[user.lang].index.start;
        bot.sendMessage(chatId, message, {
          reply_markup: mainKeyboardFn(user),
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
