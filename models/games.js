module.exports = (sequelize, DataTypes) => {
  const Games = sequelize.define("Games", {
    game_ID: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    own: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Games.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Games.belongsToMany(models.User, 
      { through: "User_Games", 
      }
    );
  };

  return Games;
};
