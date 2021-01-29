module.exports = (sequelize, DataTypes) => {
    const User_Games = sequelize.define("User_Games", {
      unique_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      own: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      game_ID: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
    },
    {
      indexes: [
        { fields: ["game_ID", "UserId"], unique: true }
      ]
    },
    { timestamps: false });

    return User_Games;
};
  