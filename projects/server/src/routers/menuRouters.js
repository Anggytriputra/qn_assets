const { menuControllers } = require("../controllers");
const menuRouters = require("express").Router();

menuRouters.get("/", menuControllers.getMenuRelation);

module.exports = menuRouters;
