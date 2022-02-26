module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        email: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true
          },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false
          },
        firstName: {
            type: Sequelize.STRING(100),
            allowNull: false
          },
        lastName: {
            type: Sequelize.STRING(100),
            allowNull: false
          },
        admin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        enabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        image_url: {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: "http://localhost:3000/images/profils/random-user.png" 
        }
    },
    {
      freezeTableName: true
    });
    
    User.associate = models => {
      User.hasMany(models.Post, {
        onDelete: "cascade"
      });

      User.hasMany(models.Comment, {
        onDelete: "cascade"
      });
    };
    
    return User;
};
