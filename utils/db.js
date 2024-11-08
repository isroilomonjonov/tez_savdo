const Sequelize = require("sequelize");
const db = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    timezone: "+05:00",
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
module.exports = db;
