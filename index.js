const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.TOKEN;
const db = require("./utils/db");
const { languageCallbackQueryFn } = require("./functions/language-callback-fn");
const { contactFn } = require("./functions/contact-fn");
const { startFn } = require("./functions/start-fn");
const cors = require("cors");
const { languageKeyboard } = require("./utils/LanguageKeyborad");
const { languages } = require("./utils/Languages");
const { getById } = require("./controllers/usersController");
const { getByIdProduct } = require("./controllers/products");
const { mainKeyboardFn } = require("./utils/MainKeyboard");
const { productsFn } = require("./functions/products/products-fn");
const { updateProductFn } = require("./functions/products/update-product-fn");
const { deleteProductFn } = require("./functions/products/delete-product-fn");
const {
  updateProductCallbackFn,
} = require("./functions/products/update-product-callback");
const {
  deleteProductCallbackFn,
} = require("./functions/products/delete-product-callback");
const { createProductFn } = require("./functions/products/create-product-fn");
const { productByNameFn } = require("./functions/products/product-byname-fn");
const {
  createUpdateProductFn,
} = require("./functions/products/create-update-product-fn");
const { decreaseProduct } = require("./functions/products/decrease_product");
const { increaseProduct } = require("./functions/products/increase-product");
const { removeProduct } = require("./functions/products/remove-product");
const { createOrder, getOrderById } = require("./controllers/ordersController");
cors();
const app = express();
const PORT = process.env.PORT || 8080;
const bot = new TelegramBot(token, { polling: true });
app.all("*", (req, res, next) => {
  return res.json({
    status: "success",
    message:
      "It is not web site or backend api please enter telegram bot @alimax_sale_bot",
    data: null,
  });
});
const start = async () => {
  try {
    await db.authenticate();
    await db.sync({
      // force: true,
      // alter: true,
    });
    const userStates = {};
    const orderInfo = {};
    const carts = {};
    const formatter = new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    bot.onText(/\/start/, async (msg) => {
      startFn(bot, msg);
    });
    bot.onText(/\/settings/, async (msg) => {
      const chatId = msg.chat.id;

      if (chatId == process.env.ADMIN) {
        return bot.sendMessage(
          chatId,
          `/start - Botni ishga tushurish! | Старт бот!\n/lang - Tilni o'zgartirish! | Изменить язык!\n/create_product - Yangi mahsulot qo'shish\n/update_product - Mahsulotni yangilash\n/delete_product - Mahsulotni o'chirish`
        );
      }

      await bot.sendMessage(
        chatId,
        `/start - Botni ishga tushurish! | Старт бот!\n/lang - Tilni o'zgartirish! | Изменить язык!`
      );
    });
    bot.onText(/\/lang/, async (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, `Tilni tanlang! | Выберите язык!`, {
        reply_markup: languageKeyboard,
      });
    });
    bot.onText(/\/create_product/, async (msg) => {
      createProductFn(bot, msg, userStates);
    });
    bot.onText(/\/update_product/, async (msg) => {
      updateProductFn(bot, msg);
    });
    bot.onText(/\/delete_product/, async (msg) => {
      deleteProductFn(bot, msg);
    });
    bot.on("contact", async (msg) => {
      contactFn(bot, msg);
    });

    bot.on("callback_query", async (callbackQuery) => {
      const user = await getById(callbackQuery.from.id);
      const chatId = callbackQuery.message.chat.id;
      const messagetwo = callbackQuery.message;
      if (callbackQuery.data == "uz" || callbackQuery.data == "ru") {
        languageCallbackQueryFn(bot, callbackQuery);
      }

      if (callbackQuery.data.startsWith("buy_")) {
        const productId = callbackQuery.data.split("_")[1];
        const product = await getByIdProduct(productId);
        const messageId = callbackQuery.message.message_id;
        if (!carts[chatId]) {
          carts[chatId] = [];
        }
        carts[chatId].push({ ...product.dataValues, quantity: 1 });
        const inlineKeyboard = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "❌" + languages[user.lang].index.clearCart,
                  callback_data: `remove_${product.id}`,
                },
              ],
              [
                { text: "➖", callback_data: `decrease_${product.id}` },
                {
                  text: `${
                    carts[chatId]?.find((p) => p.id == product.id).quantity
                  }`,
                  callback_data: "ignore",
                },
                { text: "➕", callback_data: `increase_${product.id}` },
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
      if (callbackQuery.data.startsWith("increase_")) {
        increaseProduct(bot, callbackQuery, chatId, carts, user);
      }
      if (callbackQuery.data.startsWith("decrease_")) {
        decreaseProduct(bot, callbackQuery, chatId, carts, user);
      }
      if (callbackQuery.data.startsWith("remove_")) {
        removeProduct(bot, callbackQuery, chatId, carts);
      }
      if (callbackQuery.data.startsWith("product_")) {
        updateProductCallbackFn(
          bot,
          callbackQuery,
          chatId,
          messagetwo,
          userStates,
          user
        );
      }
      if (callbackQuery.data.startsWith("deleteproduct_")) {
        deleteProductCallbackFn(bot, callbackQuery, chatId, messagetwo, user);
      }
      bot.answerCallbackQuery(callbackQuery.id);
    });

    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const user = await getById(chatId);
      const state = userStates[chatId];
      const orderState = orderInfo[chatId];
      if (user && user?.phoneNumber) {
        if (
          msg?.text?.includes("Orqaga") ||
          msg?.text?.includes("Bosh menuga qaytish") ||
          msg?.text?.includes("Вернуться в главное меню")
        ) {
          delete userStates[chatId];
          await bot.sendMessage(
            chatId,
            languages[user?.lang]?.index?.youAreAtMainMenu,
            {
              reply_markup: mainKeyboardFn(user),
            }
          );
          return;
        }
        if (
          msg?.text?.includes("Savatni tozalash!") ||
          msg?.text?.includes("Очистить корзину!")
        ) {
          carts[chatId] = [];
          await bot.sendMessage(
            chatId,
            "Savatcha tozalandi! | Корзина очищена!",
            {
              reply_markup: mainKeyboardFn(user),
            }
          );
        }
        if (
          msg?.text?.includes("Tilni o'zgartirish") ||
          msg?.text?.includes("Изменить язык")
        ) {
          bot.sendMessage(chatId, `Tilni tanlang! | Выберите язык!`, {
            reply_markup: languageKeyboard,
          });
        }
        if (
          msg?.text?.includes("Bot haqida ma'lumot.") ||
          msg?.text?.includes("Информация о боте.")
        ) {
          bot.sendMessage(chatId, languages[user?.lang]?.index?.info);
        }
        if (
          msg?.text?.includes("Товары!") ||
          msg?.text?.includes("Mahsulotlar!")
        ) {
          await productsFn(bot, msg);
        }

        if (msg?.text?.includes("Корзина") || msg?.text?.includes("Savat")) {
          if (!carts[chatId] || carts[chatId].length == 0) {
            return bot.sendMessage(chatId, "Savat bo'sh! | Корзина пуста!");
          }
          const messageBasket = `${
            carts[chatId]?.length
          } ta turdagi mahsulot | ${
            carts[chatId]?.length
          } тип продукта \n\n ${carts[chatId]?.map(
            (e) =>
              `\n${e.title} --- ${e.quantity} --- ${formatter.format(
                e.price * e.quantity
              )}`
          )}\n\n\nUmumiy summa | Общая сумма: ${formatter.format(
            carts[chatId]?.reduce((a, b) => a + b.price * b.quantity, 0)
          )}`;
          const productButtons = carts[chatId].map((product) => {
            return [{ text: product.title }];
          });
          return await bot.sendMessage(chatId, messageBasket, {
            reply_markup: {
              keyboard: [
                [
                  {
                    text: "❌ " + languages[user?.lang]?.index?.clearCart,
                  },
                  {
                    text: "✅ " + languages[user?.lang]?.index?.completeOrder,
                  },
                ],
                ...productButtons,
                ["\u{1F3E0}" + languages[user?.lang]?.index?.goMainMenu],
              ],
              resize_keyboard: true,
              one_time_keyboard: false,
            },
          });
        }
        if (
          msg?.text?.includes("Buyurtma berish!") ||
          msg?.text?.includes("Заказать!")
        ) {
          await bot.sendMessage(
            chatId,
            "Telefon raqamingizni kiriting! | Введите свой номер телефона :",
            {
              reply_markup: {
                keyboard: [
                  ["\u{1F3E0}" + languages[user?.lang]?.index?.goMainMenu],
                ],
                resize_keyboard: true,
              },
            }
          );
          orderInfo[chatId] = { step: "phoneNumber" };
        }
        if (orderState) {
          switch (orderState.step) {
            case "phoneNumber":
              orderState.phoneNumber = msg.text;
              try {
                const orderId = await createOrder(
                  orderState,
                  chatId,
                  carts[chatId]
                );

                bot.sendMessage(
                  chatId,
                  "Sizning buyurtmangiz qabul qilindi! | Ваш заказ оформлен!",
                  {
                    reply_markup: mainKeyboardFn(user),
                  }
                );
                const order = await getOrderById(orderId.id);
                console.log(order);
                bot.sendMessage(
                  process.env.CHANNEL_ID,
                  `Yangi buyurtma!!!\n\n` +
                    order?.orderItems?.map(
                      (e) =>
                        `\n${e.product.title} --- ${
                          e.quantity
                        } --- ${formatter.format(Number(e.subtotal))}`
                    ) +
                    `\n\nUmumiy summa | Общая сумма: ${formatter.format(
                      Number(order.totalPrice)
                    )}\n\nBuyurtmachi ma'lumotlari\n\nIsmi: ${
                      order?.user?.first_name
                    }\n${
                      order?.user?.username &&
                      `Username: @${order?.user?.username}`
                    } \nTelefon raqami: ${
                      order?.user?.phoneNumber
                    } \nBuyurtma uchun foydalanuvchi telefon raqami: ${
                      order?.phoneNumber
                    }`
                );
              } catch (error) {
                bot.sendMessage(
                  chatId,
                  "Buyurtma qabul qilinmadi hatolik yuz berdi. | Не удалось оформить заказ по причине ошибки.",
                  {
                    reply_markup: mainKeyboardFn(user),
                  }
                );
                console.error(error);
              } finally {
                delete orderInfo[chatId];
                delete carts[chatId];
              }
              break;
          }
        }
        if (
          msg?.text?.includes("Mahsulot yaratish!") ||
          msg?.text?.includes("Создать продукт!") ||
          msg?.text?.includes("Yangilash")
        ) {
          return;
        }
        if (!state) {
          productByNameFn(bot, msg, chatId, carts, user);
        }
        if (user.id !== process.env.ADMIN) return;

        if (!state) return;
        createUpdateProductFn(bot, msg, chatId, state, userStates);
        if (
          !msg?.text?.includes("Bot haqida ma'lumot.") &&
          !msg?.text?.includes("Информация о боте.") &&
          !msg?.text?.includes("Tilni o'zgartirish") &&
          !msg?.text?.includes("Изменить язык") &&
          !msg?.text?.includes("Mahsulotlar!") &&
          !msg?.text?.includes("Товары!") &&
          !msg?.text?.includes("start")
        ) {
          // const message = languages[user?.lang]?.index?.start;
          // bot.sendMessage(chatId, message, {
          //   reply_markup: mainKeyboardFn(user),
          // });
        }
      }
    });
    app.listen(PORT, () => {
      console.log(`Server ${PORT}-portda ishga tushdi`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
