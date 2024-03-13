const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/dbConnect");
connectDB();
const userRouter = require("./src/routes/user");
const productRouter = require("./src/routes/product");
const categoryRouter = require("./src/routes/category");
const orderRouter = require("./src/routes/order");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/order", orderRouter);

app.listen(5000, () => console.log("Server on"));
