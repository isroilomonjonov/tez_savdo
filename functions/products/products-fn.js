const { getAllProducts } = require("../../controllers/products");
const { getById } = require("../../controllers/usersController");
const { languages } = require("../../utils/Languages");

exports.productsFn = async (bot, msg) => {
  try {
    const chatId = msg.chat.id;
    const user = await getById(chatId);
    const products = await getAllProducts();
    if (products.rows.length === 0) {
      bot.sendMessage(chatId, "Mahsulotlar mavjud emas.");
    } else {
      const productButtons = products.rows.map((product) => {
        return [{ text: product.title }];
      });

      bot.sendMessage(chatId, "Mahsulotlar ro'yxati:", {
        reply_markup: {
          keyboard: [
            ...productButtons,
            [
              { text: "\u{1F3E0}" + languages[user?.lang]?.index?.goMainMenu },
              {
                text: "🛒 " + languages[user?.lang]?.index?.basket,
              },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: false,
        },
      });
    }
    // bot.sendMessage(chatId, languages[user?.lang]?.index?.pleaseSendLocation, {
    //   reply_markup: {
    //     keyboard: [
    //       [
    //         products?.rows.map((e) => {
    //           return {
    //             text: e.title,
    //           };
    //         }),
    //       ],
    //       ["\u{1F3E0}" + languages[user?.lang]?.index?.goMainMenu],
    //     ],
    //     resize_keyboard: true,
    //     one_time_keyboard: true,
    //   },
    // });
  } catch (error) {
    console.log(error);
  }
};
