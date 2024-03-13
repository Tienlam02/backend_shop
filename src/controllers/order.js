const Order = require("../models/order");
const User = require("../models/user");
const createOrder = async (req, res) => {
  try {
    const { inforUser, cart, totalPriceOrder } = req.body;
    const { fullname, phone, address } = inforUser;
    if (!fullname || !phone || !address || !cart || !totalPriceOrder)
      return res
        .status(400)
        .json({ success: 0, message: "Vui lòng cung cấp đủ thông tin" });

    const data = await Order.create({
      products: cart,
      totalPriceOrder,
      fullname,
      address,
      phone,
      orderBy: req.user._id,
    });

    res.status(200).json({
      success: data ? 1 : 0,
      user: data ? data : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server",
      success: 0,
      error,
    });
  }
};
const getOrder = async (req, res) => {
  try {
    const { _id } = req.user;

    const data = await Order.find({ orderBy: _id }).populate(
      "products.productId"
    );

    res.status(200).json({
      success: data ? 1 : 0,
      order: data ? data : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server",
      success: 0,
      error,
    });
  }
};
const getOrders = async (req, res) => {
  try {
    const data = await Order.find().populate("products.productId");

    res.status(200).json({
      success: data ? 1 : 0,
      order: data ? data : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server",
      success: 0,
      error,
    });
  }
};
const updateOrder = async (req, res) => {
  try {
    const { id, status } = req.body.data;

    if (!id || !status) return res.status(400).json({ success: 0 });
    const data = await Order.findByIdAndUpdate(id, { status });

    res.status(200).json({
      success: data ? 1 : 0,
      message: data ? "Cập nhật đơn hàng thành công" : "Lỗi",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server",
      success: 0,
      error,
    });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
};
