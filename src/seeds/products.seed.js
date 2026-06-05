const Product = require("./../models/product.model");
const Category = require("./../models/category.model");
const Supplier = require("./../models/supplier.model");

const generateProducts = async () => {
  const categories = await Category.find();
  const suppliers = await Supplier.find();

  const products = [];

  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];

    products.push({
      name: `Product ${i}`,

      slug: `product-${i}`,

      sku: `SKU${1000 + i}`,

      shortDescription: `Short description ${i}`,

      description: `Description for product ${i}`,

      categoryId: category._id,

      supplierId: supplier._id,

      brand: supplier.name,

      price: Math.floor(Math.random() * 100000) + 1000,

      salePrice: Math.floor(Math.random() * 50000) + 500,

      quantity: Math.floor(Math.random() * 100),

      isAvailable: Math.random() > 0.2,

      status: "ACTIVE",

      images: [`https://dummyimage.com/product-${i}.jpg`],

      specifications: {
        color: "Black",
        warranty: "1 Year",
      },
    });
  }

  return products;
};

module.exports = generateProducts;
