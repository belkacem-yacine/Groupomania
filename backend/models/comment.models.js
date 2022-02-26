module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comments', {
        comment: {
            type: Sequelize.STRING(500),
            allowNull: false,
          },
    },
    {
        freezeTableName: true
    });

    Comment.associate = models => {
        Comment.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });

        Comment.belongsTo(models.Post, {
            foreignKey: {
                allowNull: false
            },
            constraints: false
        });
    };
    return Comment;
};