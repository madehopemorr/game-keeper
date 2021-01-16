module.exports = (sequelize, DataTypes) => {
    const Games = sequelize.define('Games', {
        title: {
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