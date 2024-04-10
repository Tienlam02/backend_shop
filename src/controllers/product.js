const Product = require("../models/product");

const getProducts = async (req, res) => {
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

    let queryCommand = Product.find(formatedQueries);

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
    const limit = +req.query.limit || 8;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    const [response, count] = await Promise.all([
      queryCommand,
      Product.find(formatedQueries).countDocuments(),
    ]);

    return res.status(200).json({
      success: response ? 1 : 0,
      count,
      page,
      products: response ? response : "Something went wrong",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
  }
};
const getProduct = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: 0 });
    const response = await Product.findById(id);
    return res.status(200).json({
      success: response ? 1 : 0,
      product: response ? response : "Something went wrong",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { _id } = req.query;
    if (!_id) return res.status(400).json({ success: 0 });
    const data = await Product.findByIdAndDelete(_id);
    res.status(200).json({
      success: data ? 1 : 0,
      productId: data ? data._id : "",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, category, desc } = req.body;
    const image = req.file?.path;
    if (!name || !price || !image || !quantity || !category || !desc)
      return res
        .status(400)
        .json({ success: 0, mess: "Vui lòng cung cấp đủ thông tin" });
    const product = await Product.findOne({ name });
    if (product) {
      return res.status(400).json({ success: 0, mess: "Sản phẩm đã tồn tại" });
    } else {
      const data = await Product.create({
        name,
        price,
        quantity,
        category,
        desc,
        image,
      });
      res.status(200).json({
        success: data ? 1 : 0,
        products: data ? data : "",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
  }
};
const updateFullProduct = async (req, res) => {
  try {
    const { name, price, quantity, category, desc, _id } = req.body;
    const image = req.file?.path;
    if (!_id || !name || !price || !image || !quantity || !category || !desc)
      return res
        .status(400)
        .json({ success: 0, mess: "Vui lòng cung cấp đủ thông tin" });
    const product = await Product.findOne({ name });

    const data = await Product.findByIdAndUpdate(_id, {
      name,
      price,
      quantity,
      category,
      desc,
      image,
    });
    res.status(200).json({
      success: data ? 1 : 0,
      products: data ? data : "",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server",
      success: 0,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateFullProduct,
};
