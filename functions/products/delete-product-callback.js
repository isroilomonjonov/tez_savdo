const { deleteProduct } = require("../../controllers/products");
const { languages } = require("../../utils/Languages");
const { mainKeyboardFn } = require("../../utils/MainKeyboard");

exports.deleteProductCallbackFn = async (
  bot,
  callbackQuery,
  chatId,
  messagetwo,
  user
) => {
    const productId = callbackQuery.data.split("_")[1];
    try {
      await deleteProduct(productId);
      await bot.editMessageText("Mahsulot muvaffaqiyatli o'chirildi!", {
        chat_id: chatId,
        message_id: messagetwo.message_id,
      });
      await bot.sendMessage(
        chatId,
        languages[user?.lang]?.index?.youAreAtMainMenu,
        {
          reply_markup:mainKeyboardFn(user),
        }
      );
    } catch (error) {
      await bot.sendMessage(callbackQuery.from.id, "Xatolik yuz berdi.", {
        reply_markup: {
          keyboard: [
            ["\u{1F3E0}" + languages[user?.lang]?.index?.goMainMenu],
          ],
          resize_keyboard: true,
        },
      });
    }
};
