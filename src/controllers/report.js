const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

const income = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0 - startOfWeek.getDay() * 86400000);

    // Lấy ngày cuối cùng của tuần hiện tại
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const [
      inCome,
      totalProduct,
      totalOrder,
      totalUser,
      numberOfProductPerCat,
      totalOrderOfDay,
      newUserOfDay,
      ,
    ] = await Promise.all([
      Order.find({ status: "Success" }).select("totalPriceOrder"),
      Product.find().countDocuments(),
      Order.find().countDocuments(),
      Order.find().countDocuments(),
      Product.aggregate([
        {
          $group: {
            _id: "$category", // Nhóm theo category
            count: { $sum: 1 }, // Đếm số lượng sản phẩm trong mỗi nhóm
          },
        },
        {
          $lookup: {
            from: "categories", // Tên của collection Category trong database
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $project: {
            _id: 0,
            categoryName: { $arrayElemAt: ["$category.name", 0] }, // Lấy tên danh mục
            productCount: "$count", // Lấy số lượng sản phẩm
          },
        },
      ]),
      Order.find({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      }).countDocuments(),
      User.find({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      }).countDocuments(),
    ]);

    res.status(200).json({
      success: inCome ? 1 : 0,
      inCome: inCome ? inCome : null,
      totalProduct: totalProduct ? totalProduct : null,
      totalOrder: totalOrder ? totalOrder : null,
      totalUser: totalUser ? totalUser : null,
      numberOfProductPerCat: numberOfProductPerCat
        ? numberOfProductPerCat
        : null,
      totalOrderOfDay: totalOrderOfDay ? totalOrderOfDay : null,
      newUserOfDay: newUserOfDay ? newUserOfDay : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: 0,
      message: "Internal server",
    });
  }
};

module.exports = {
  income,
};
