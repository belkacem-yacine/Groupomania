const bcrypt = require('bcrypt');

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
          image_url: {
            type: Sequelize.STRING(255),
            default: "./uploads/profil/random-user.png"
          },
          enabled: {
            type: Sequelize.STRING(100)
          }
        },
        {
          freezeTableName: true
        });

    return User;
};
