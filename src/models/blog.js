const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    comment: [
      {
        commentByUser: { type: mongoose.Types.ObjectId, ref: "User" },
        content: {
          type: String,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
