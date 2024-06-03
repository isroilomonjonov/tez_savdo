const { languages } = require("./Languages");

exports.mainKeyboardFn = (user) => {
  return {
    keyboard: [
      [
        {
          text: "\u{2712} " + languages[user?.lang]?.index?.productsMSG,
        },
        {
          text: "🛒 " + languages[user?.lang]?.index?.basket,
        },
      ],
      [
        {
          text: "\u{1F30F}" + languages[user?.lang]?.index?.setLanguageMsg,
        },
        {
          text: "\u{1F4C4} " + languages[user?.lang]?.index?.getInfoAboutPhone,
        },
      ],
    ],
    resize_keyboard: true,
  };
};
