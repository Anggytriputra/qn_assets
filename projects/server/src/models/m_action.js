"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class m_action extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  m_action.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "m_action",
      tableName: "m_action",
    }
  );
  return m_action;
};
