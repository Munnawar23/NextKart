import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/user.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import connectDB from "./config/connect.js";
import { PORT } from "./config/config.js";
import { buildAdminJS } from "./config/setup.js";

dotenv.config();

// Express
const app = express();
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);

// Server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); // Await the database connection
    console.log("Database connected successfully!"); // Added console log
    await buildAdminJS(app)

    app.listen(PORT, "0.0.0.0", (err,addr) => { // Corrected listen syntax
      if (err) {
        console.log("Error:", err);
      } else {
        console.log(`Server started on port ${PORT}/admin`); // More informative message
      }
    });
  } catch (error) {
    console.log("Error Starting Server ->", error);
  }
};

start();