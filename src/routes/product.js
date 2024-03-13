const productRouter = require("express").Router();
const ctl = require("../controllers/product");
const { verifyToken, isAdmin } = require("../middleware/verifytoken");
const upload = require("../config/cloudinary");
productRouter.get("/", ctl.getProducts);
productRouter.get("/:id", ctl.getProduct);
productRouter.post(
  "/",
  [verifyToken, isAdmin],
  upload.single("image"),
  ctl.createProduct
);
productRouter.put(
  "/",
  [verifyToken, isAdmin],
  upload.single("image"),
  ctl.updateFullProduct
);
productRouter.delete("/", [verifyToken, isAdmin], ctl.deleteProduct);

module.exports = productRouter;
