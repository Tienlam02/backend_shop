const orderRouter = require("express").Router();
const ctl = require("../controllers/order");
const { verifyToken, isAdmin } = require("../middleware/verifytoken");

orderRouter.post("/", verifyToken, ctl.createOrder);
orderRouter.get("/user", verifyToken, ctl.getOrder);
orderRouter.get("/", [verifyToken, isAdmin], ctl.getOrders);
orderRouter.put("/", [verifyToken, isAdmin], ctl.updateOrder);
orderRouter.delete("/", verifyToken, ctl.cancelOrder);

module.exports = orderRouter;
