const Category = require("../models/category");

const getCategories = async (req, res) => {
  try {
    const data = await Category.find();
    res.status(200).json({
      success: data ? 1 : 0,
      categories: data ? data : "",
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
  getCategories,
};
