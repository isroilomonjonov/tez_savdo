const flags = {
  uz: "🇺🇿",
  ru: "🇷🇺",
};
exports.languageKeyboard = {
  inline_keyboard: [
    [
      { text: flags.ru + "Русский", callback_data: "ru" },
      { text: flags.uz + "O‘zbekcha", callback_data: "uz" },
    ],
  ],
  one_time_keyboard: false,
  selective: true,
  resize_keyboard: true,
};
