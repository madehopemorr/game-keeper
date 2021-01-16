module.exports = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('Wish-list', {
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

    Wishlist.associate = (models) => {
        Wishlist.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Wishlist
};