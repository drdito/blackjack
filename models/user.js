module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    display_name: DataTypes.STRING,
    firstName: DataTypes.STRING,
    google_id: DataTypes.STRING,
    google_image: DataTypes.STRING,
    player_funds: DataTypes.INTEGER
  },{
    timestamps: false
  }
);
  return User;
};


