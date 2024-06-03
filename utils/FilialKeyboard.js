const { languages } = require("./Languages");

exports.filialKeyboardFn = (user) => {
  return {
    keyboard: [
      [
        {
          text: "Tashkent Index",
        },
        {
          text: "Moshina bozor",
        },
      ],
      ["\u{1F3E0}" + languages[user?.lang]?.index?.goMainMenu],
    ],
    one_time_keyboard: true,
    selective: true,
    resize_keyboard: true,
  };
};
