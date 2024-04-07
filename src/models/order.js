const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],

    totalPriceOrder: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      default: "Proccessing",
      enum: [
        "Cancelled",
        "Proccessing",
        "Accept",
        "Shiping",
        "Success",
        "Return",
      ],
    },
    fullname: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
