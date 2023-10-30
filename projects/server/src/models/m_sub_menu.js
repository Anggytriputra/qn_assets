"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class m_sub_menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      m_sub_menu.belongsTo(models.m_menu, {
        foreignKey: "m_menu_id",
      });
    }
  }
  m_sub_menu.init(
    {
      m_menu_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "m_sub_menu",
      tableName: "m_sub_menu",
    }
  );
  return m_sub_menu;
};
