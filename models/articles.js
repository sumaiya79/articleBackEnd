'use strict';
module.exports = (sequelize, DataTypes) => {
    let articles = sequelize.define('articles', {
        title: DataTypes.TEXT,
        description: DataTypes.TEXT,
        publishdate: DataTypes.DATE,
        image: DataTypes.TEXT
    }, {timestamps: false});
    articles.associate = function(models) {

  };
  return articles;
};