const dotenv = require("dotenv");
dotenv.config({
    path: "./config.env"
})

const mongoose = require("mongoose");
const Product = require("./../models/product.model");
const Category = require("./../models/category.model");
const Supplier = require("./../models/supplier.model");

const categories = require("./categories.seed");
const suppliers = require("./suppliers.seed");
const generateProducts = require("./products.seed");

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("DB connection success");

    //clear collections
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Supplier.deleteMany({});
    console.log("Old data removed");

    //Insert data to db collections
    await Category.insertMany(categories);
    await Supplier.insertMany(suppliers);
    console.log("Categories inserted");
    console.log("Suppliers inserted");

    const products = await generateProducts();
    await Product.insertMany(products);
    console.log("Products inserted");

    process.exit(0);
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

seedDatabase();
