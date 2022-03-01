module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define('posts', {
        post: {
            type: Sequelize.STRING(500),
            allowNull: false,
          },
        image_url: {
          type: Sequelize.STRING(255),
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
          },
    },
    {
        freezeTableName: true
    });

    Post.associate = models => {
        Post.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });

        Post.hasMany(models.Comment, {
            onDelete: "cascade" 
        });
    };
    return Post;
};