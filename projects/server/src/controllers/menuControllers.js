const db = require("../models");
const sequelize = db.sequelize;

async function getMenuRelation(req, res) {
  try {
    const m_menu_realation = await db.m_menu_relation.findAndCountAll({
      include: [
        {
          model: db.m_sub_menu,
          attributes: ["id", "name"],
          include: [{ model: db.m_menu, attributes: ["id", "name"] }],
        },
        { model: db.m_action, attributes: ["id", "name"] },
        { model: db.m_role, attributes: ["id", "view_name"] },
      ],
    });

    res.status(200).send({ message: "Succesfuly get menu relation" });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getMenuRelation,
};
