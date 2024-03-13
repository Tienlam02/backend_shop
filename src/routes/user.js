const userRouter = require("express").Router();
const ctl = require("../controllers/user");
const { verifyToken, isAdmin } = require("../middleware/verifytoken");
userRouter.post("/register", ctl.register);
userRouter.post("/login", ctl.login);
userRouter.put("/updateCart", verifyToken, ctl.updateCart);
userRouter.put("/decrementCart", verifyToken, ctl.decrementCart);
userRouter.put("/incrementCart", verifyToken, ctl.incrementCart);
userRouter.delete("/deleteCart", verifyToken, ctl.deleteCart);

userRouter.get("/current", verifyToken, ctl.getCurrent);

// check admin và user
userRouter.get("/userAuth", verifyToken, (req, res) => {
  res.status(200).json({ success: 1 });
});
userRouter.get("/adminAuth", [verifyToken, isAdmin], (req, res) => {
  res.status(200).json({ success: 1 });
});

module.exports = userRouter;
