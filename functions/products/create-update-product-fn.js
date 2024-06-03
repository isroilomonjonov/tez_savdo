const { updateProduct, createProduct } = require("../../controllers/products");

exports.createUpdateProductFn = async (bot, msg, chatId, state, userStates) => {
  switch (state.step) {
    case "name":
      state.title = msg.text;
      bot.sendMessage(chatId, "Mahsulot tavsifini kiriting:");
      state.step = "description";
      break;
    case "description":
      state.description = msg.text;
      bot.sendMessage(chatId, "Mahsulot narxini kiriting:");
      state.step = "price";
      break;
    case "price":
      state.price = parseFloat(msg.text);
      if (isNaN(state.price)) {
        bot.sendMessage(chatId, "Iltimos, to‘g‘ri narx kiriting:");
      } else {
        bot.sendMessage(chatId, "Mahsulot rasmini jo'nating:");
        state.step = "image";
      }
      break;
    case "image":
      // Foydalanuvchidan rasm yuborilganda
      if (msg.photo) {
        // Rasmni olish
        const photo = msg.photo[msg.photo.length - 1];
        const photoId = photo.file_id;
        state.image = photoId;
        try {
          if (state.command === "update") {
            console.log(state.id);
            await updateProduct(state.id, {
              title: state.title,
              description: state.description,
              price: state.price,
              image: state.image,
            });
            bot.sendMessage(chatId, "Mahsulot muvaffaqiyatli yangilandi!");
          } else {
            await createProduct({
              title: state.title,
              description: state.description,
              price: state.price,
              image: state.image,
            });
            bot.sendMessage(chatId, "Mahsulot muvaffaqiyatli yaratildi!");
          }
        } catch (error) {
          bot.sendMessage(chatId, "Mahsulotni yaratishda xatolik yuz berdi.");
          console.error(error);
        }
        delete userStates[chatId];
      } else {
        bot.sendMessage(chatId, "Iltimos, rasm yuboring:");
        delete userStates[chatId];
      }
      break;
  }
};
