var Sequelize = require("sequelize");
var sequelize = require("../config/connection.js");

// Creates a "Chirp" model that matches up with DB
var User = sequelize.define("user", {
  display_name: Sequelize.STRING,
  firstName: Sequelize.STRING,
  google_id: Sequelize.STRING,
  google_image: Sequelize.STRING,
  player_funds: Sequelize.INTEGER
});

// Syncs with DB
User.sync();

// Makes the Chirp Model available for other files (will also create a table)
module.exports = User;