import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/product.js";
import Category from "./models/category.js";
import { categoriesData, productData } from "./seedData.js";

dotenv.config();

async function seedDatabase() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }

        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        await Product.deleteMany({});
        await Category.deleteMany({});

        const categoriesDocs = await Category.insertMany(categoriesData);

        const categoryMap = categoriesDocs.reduce((map, category) => {
            map[category.name] = category._id; // Keeping `name` as the key
            return map;
        }, {});

        const productWithCategoryIds = productData.map((product) => ({
            ...product,
            category: categoryMap[product.category], // Assigning the correct category ID
        }));

        await Product.insertMany(productWithCategoryIds);

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error Seeding Database:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
}

// Call the function
seedDatabase();
