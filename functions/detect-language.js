const { languages } = require("../utils/Languages");

exports.detectLanguage = (msg) => {
  // Example: detect language based on user's Telegram language setting
  const userLanguageCode = msg.from.language_code;
  if (userLanguageCode && languages[userLanguageCode]) {
    return userLanguageCode;
  } else {
    return "uz"; // Default to English if language not supported
  }
};
