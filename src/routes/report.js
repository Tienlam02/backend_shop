const reportRouter = require("express").Router();
const ctl = require("../controllers/report");
const { verifyToken, isAdmin } = require("../middleware/verifytoken");
reportRouter.get("/", [verifyToken, isAdmin], ctl.income);

module.exports = reportRouter;
