const CategoryRouter = require("express").Router();
const ctl = require("../controllers/category");
const { verifyToken } = require("../middleware/verifytoken");

CategoryRouter.get("/", ctl.getCategories);

module.exports = CategoryRouter;
