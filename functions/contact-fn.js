const {
  updateUser,
  createUser,
  getById,
} = require("../controllers/usersController");
const { languages } = require("../utils/Languages");
const { mainKeyboardFn } = require("../utils/MainKeyboard");

exports.contactFn = async (bot, msg) => {
  try {
    const chatId = msg.chat.id;
    const phoneNumber = msg.contact.phone_number;
    const user = await getById(msg.from.id);
    let newUser;
    if (user) {
      newUser = await updateUser({ ...msg.chat, phoneNumber });
    } else {
      newUser = await createUser({ ...msg.chat, phoneNumber });
    }
    bot.sendMessage(
      process.env.CHANNEL_ID,
      `Yangi user ro'yhatdan o'tdi \u{0023}${newUser?.id}user \n\n 1.Ismi: ${
        newUser?.first_name || ""
      } ${newUser?.last_name || ""} \n ${
        newUser?.username ? `2. Username: @${newUser?.username}` : "2."
      } \n ${
        newUser?.phoneNumber?.includes("+")
          ? "3. Telefon raqami: " + newUser.phoneNumber
          : "3. Telefon raqami: " + "+" + newUser.phoneNumber
      }`
    );
    return bot.sendMessage(
      chatId,
      languages[user?.lang]?.index?.yourPhoneNumberHasAccepted + phoneNumber,
      {
        reply_markup: mainKeyboardFn(user),
      }
    );
    // const mainMenuKeyboard = {
    //   reply_markup: {
    //     keyboard: [[{ text: "Raqamni jo'natish", request_contact: true }]],
    //     resize_keyboard: true,
    //   },
    // };
  } catch (error) {
    console.log(error);
  }
};
