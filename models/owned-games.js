module.exports = (sequelize, DataTypes) => {
    const Games = sequelize.define('Record', {
        gameTitle: {
            type: DataTypes.STRING
        },
        rating: {
            type: DataTypes.INTEGER
        },
        playTime: {
            type: DataTypes.INTEGER
        },
        age: {
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
}