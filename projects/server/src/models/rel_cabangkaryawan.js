"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rel_cabangkaryawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      rel_cabangkaryawan.belongsTo(models.m_cabang, {
        foreignKey: "id_cabang",
      });
    }
  }
  rel_cabangkaryawan.init(
    {
      id_cabang: DataTypes.INTEGER,
      id_karyawan: DataTypes.INTEGER,
      notes: DataTypes.TEXT,
      flag_active: DataTypes.INTEGER,
      isUpdated: DataTypes.INTEGER,
      isDeleted: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdDtm: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedDtm: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "rel_cabangkaryawan",
      tableName: "rel_cabangkaryawan",
      timestamps: true,
      createdAt: "createdDtm",
      updatedAt: "updatedDtm",
    }
  );
  return rel_cabangkaryawan;
};
