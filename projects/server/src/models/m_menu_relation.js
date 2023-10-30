"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class m_menu_relation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      m_menu_relation.belongsTo(models.m_sub_menu, {
        foreignKey: "m_sub_menu_id",
      });
      m_menu_relation.belongsTo(models.m_action, {
        foreignKey: "m_action_id",
      });
      m_menu_relation.belongsTo(models.m_role, {
        foreignKey: "m_role_id",
      });
    }
  }

  m_menu_relation.init(
    {
      m_menu_id: DataTypes.INTEGER,
      m_sub_menu_id: DataTypes.INTEGER,
      m_action_id: DataTypes.INTEGER,
      m_role_id: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "m_menu_relation",
      tableName: "m_menu_relation",
    }
  );
  return m_menu_relation;
};
