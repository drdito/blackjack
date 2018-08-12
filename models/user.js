var Sequelize = require("sequelize");
var sequelize = require("../config/connection.js");


var User = sequelize.define("user", {
  display_name: Sequelize.STRING,
  firstName: Sequelize.STRING,
  google_id: Sequelize.STRING,
  google_image: Sequelize.STRING,
  player_funds: Sequelize.INTEGER
});

User.sync();


module.exports = User;