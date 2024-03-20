const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password || username.length < 6 || password.length < 6)
      return res
        .status(400)
        .json({ success: 0, message: "Vui lòng cung cấp đủ thông tin" });
    const user = await User.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: 0, message: "Người dùng đã tồn tại!" });
    const newUser = await User.create({ username, password });
    res.status(200).json({
      success: newUser ? 1 : 0,
      message: newUser ? "Register success" : "Register faild",
    });
  } catch (error) {
    res.status(500).json({
      success: 0,
      message: "Internal server",
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ success: 0 });
    const cart = await User.findOne({ _id: req.user._id });
    const isExistCart = cart.cart.find(
      (item) => item?.product?.toString() == _id
    );
    if (isExistCart) {
      res.status(200).json({
        success: 0,
        message: "Sản phẩm đã tồn tại trong giỏ hàng.",
      });
    } else {
      const data = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            cart: {
              product: _id,
              quantity: 1,
            },
          },
        },
        { new: true }
      ).populate("cart.product");
      res.status(200).json({
        success: data ? 1 : 0,
        message: data ? "Thêm sản phẩm vào giỏ hàng thành công" : "",
        user: data ? data : "",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: 0,
      message: error,
    });
  }
};
const deleteCart = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ success: 0, message: "Cần id" });
    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { cart: { _id: _id } } },
      { new: true }
    ).populate("cart.product");
    res.status(200).json({
      success: user ? 1 : 0,
      message: user ? "Xóa sản phẩm ra khỏi giỏ hàng thành công" : " ",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: 0,
      message: error,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: 0, message: "Vui lòng cung cấp đủ thông tin" });
  const user = await User.findOne({ username }).populate("cart.product");

  if (user) {
    const isCorrectPassword = bcrypt.compareSync(password, user.password);
    if (isCorrectPassword) {
      const accessToken = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).json({
        success: 1,
        accessToken,
        user,
      });
    }
  } else {
    return res.status(400).json({
      success: 0,
      message: "Người dùng không tồn tại.",
    });
  }
  res.status(400).json({
    success: 0,
    message: "Sai tên người dùng hoặc mật khẩu?",
  });
};

const getCurrent = async (req, res) => {
  try {
    const { _id } = req.user;
    const data = await User.findOne({ _id: _id }).populate("cart.product");
    res.status(200).json({
      success: data ? 1 : 0,
      user: data ? data : "",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: 0,
      message: "Internal server?",
    });
  }
};

const decrementCart = async (req, res) => {
  try {
    let { _id, quantity } = req.body;
    quantity -= 1;

    if (!_id || !quantity) return res.status(400).json({ success: 0 });
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, "cart._id": _id },
      { $set: { "cart.$.quantity": quantity } },
      { new: true }
    ).populate("cart.product");

    res.status(200).json({ user: user ? user : "", success: user ? 1 : 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: 0,
      message: "Internal server?",
    });
  }
};
const incrementCart = async (req, res) => {
  try {
    let { _id, quantity } = req.body;
    quantity += 1;

    if (!_id || !quantity) return res.status(400).json({ success: 0 });
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, "cart._id": _id },
      { $set: { "cart.$.quantity": quantity } },
      { new: true }
    ).populate("cart.product");

    res.status(200).json({ user: user ? user : "", success: user ? 1 : 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: 0,
      message: "Internal server?",
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users: users ? users : "", success: users ? 1 : 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: 0,
      message: "Internal server?",
    });
  }
};
const changeRole = async (req, res) => {
  try {
    const { _id, role } = req.body;

    if (!_id || !role) return res.status(400).json({ success: 0 });
    if (req.user.role !== 1) return res.status(400).json({ success: 0 });
    const user = await User.findByIdAndUpdate(_id, { role }, { new: true });
    res.status(200).json({ success: user ? 1 : 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: 0,
      message: "Internal server?",
    });
  }
};
const deleteUserByAd = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) return res.status(400).json({ success: 0 });

    const user = await User.findByIdAndDelete(_id);
    res.status(200).json({ success: user ? 1 : 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: 0,
      message: "Internal server?",
    });
  }
};

module.exports = {
  register,
  login,
  updateCart,
  getCurrent,
  deleteCart,
  decrementCart,
  incrementCart,
  getUsers,
  changeRole,
  deleteUserByAd,
};
