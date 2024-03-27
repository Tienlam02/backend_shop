const blogRouter = require("express").Router();
const ctl = require("../controllers/blog");

const { verifyToken, isAdmin } = require("../middleware/verifytoken");
const upload = require("../config/cloudinary");
blogRouter.get("/", ctl.getBlogs);
blogRouter.get("/:id", ctl.getBlog);
blogRouter.post(
  "/",
  [verifyToken, isAdmin],
  upload.single("image"),
  ctl.createBlog
);
module.exports = blogRouter;
