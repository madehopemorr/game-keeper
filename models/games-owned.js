module.exports = (sequelize, DataTypes) => {
    const Games = sequelize.define('Games', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        avgUserRating: {
            type: DataTypes.INTEGER
        },
        players: {
            type: DataTypes.INTEGER
        },
        gameTime: {
            type: DataTypes.INTEGER
        },
        age: {
            type: DataTypes.INTEGER
        },
        rules: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.INTEGER
        }

    })

    Games.associate = (models) => {
        Games.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Games
};