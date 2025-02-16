import dotenv from "dotenv"
import express from "express";
import userRoutes from "./routes/user.js"
import categoryRoutes from "./routes/category.js"
import productRoutes from "./routes/product.js"

dotenv.config()

//Express
const app = express();
app.use(express.json());

//Routes
app.use("/user",userRoutes)
app.use("/category",categoryRoutes)
app.use("/product",productRoutes)

//Server
const start = async () => {
    try {
        app.listen(3000, "0.0.0.0", (err) => {
            if (err) {
                console.log("Error:", err);
            } else {
                console.log("Server started on http://localhost:3000");
            }
        });
    } catch (error) {
        console.log("Error Starting Server ->", error);
    }
};
start(); 
