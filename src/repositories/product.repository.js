const Product = require("./../models/product.model");

const getProducts = async () => {
  return Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "supplier",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $unwind: "$supplier",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        price: 1,
        salesPrice: 1,
        isAvailable: 1,
        category: {
          id: "$category._id",
          name: "$category.name",
        },
        supplier: {
          id: "$supplier._id",
          name: "$supplier.name",
        },
      },
    },
  ]);
};

module.exports = {
    getProducts
};
