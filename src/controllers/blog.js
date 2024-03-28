const Blog = require("../models/blog");

const getBlogs = async (req, res) => {
  try {
    const queries = { ...req.query };

    //tách các trường đặc biệt
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    //format lại các trường
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (matchedEl) => `$${matchedEl}`
    );
    const formatedQueries = JSON.parse(queryString);

    if (queries?.name)
      // tìm kiếm theo name có chứa 1 từ trong title gửi từ client
      formatedQueries.name = { $regex: queries.name, $options: "i" };

    let queryCommand = Blog.find(formatedQueries);

    // sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    }

    // fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    } else {
      queryCommand = queryCommand.select("-__v");
    }

    // pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    const [response, count] = await Promise.all([
      queryCommand,
      Blog.find(formatedQueries).countDocuments(),
    ]);
    res.status(200).json({
      success: response ? 1 : 0,
      blogs: response ? response : "",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
    console.log(error);
  }
};
const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Blog.findById(id).populate("comment.commentByUser");
    res.status(200).json({
      success: data ? 1 : 0,
      blog: data ? data : "",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
    console.log(error);
  }
};
const createBlog = async (req, res) => {
  try {
    const { name, desc } = req.body;
    const image = req.file?.path;
    if (!name || !image || !desc)
      return res
        .status(400)
        .json({ success: 0, mess: "Vui lòng cung cấp đủ thông tin" });
    const blog = await Blog.findOne({ name });
    if (blog) {
      return res.status(400).json({ success: 0, mess: "Bài viết đã tồn tại" });
    } else {
      const data = await Blog.create({
        name,
        desc,
        image,
      });
      res.status(200).json({
        success: data ? 1 : 0,
        mess: "Thêm mới bài viết thành công",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
    console.log(error);
  }
};
const comment = async (req, res) => {
  try {
    const { _id } = req.user;
    const { id, desc } = req.body;
    if (!id || !_id || !desc)
      return res
        .status(400)
        .json({ success: 0, mess: "Vui lòng cung cấp đủ thông tin" });
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $push: {
          comment: {
            commentByUser: _id,
            content: desc,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: blog ? 1 : 0,
      mess: "Đã thêm mới bình luận",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
    console.log(error);
  }
};
const deleteBlog = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id)
      return res
        .status(400)
        .json({ success: 0, mess: "Vui lòng cung cấp đủ thông tin" });
    const blog = await Blog.findByIdAndDelete(_id);

    res.status(200).json({
      success: blog ? 1 : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
    console.log(error);
  }
};

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  comment,
  deleteBlog,
};
