const { languages } = require("./Languages");

exports.orderSaveOrUpdateKeyboardFn = (user) => {
  return {
    inline_keyboard: [
      [
        {
          text: "\u{270F}" + languages[user?.lang]?.index?.yesIAddAgain,
          callback_data: "addAnotherDesc",
        },
        {
          text: "\u{1F4BE}" + languages[user?.lang]?.index?.completeOrder,
          callback_data: "completeOrder",
        },
      ],
    ],
    one_time_keyboard: true,
    selective: true,
    resize_keyboard: true,
  };
};
