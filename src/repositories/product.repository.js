const Product = require("./../models/product.model");


const getProducts = async (query) => {
//parse query params
const page = Number(query.page) || 1;
const limit = Number(query.limit) || 10;
const skip = (page - 1) * limit;
const sort = query.sort || "-createdAt";

//build match stage
const matchStage = {
  status: "ACTIVE",
};

if (query.isAvailable !== undefined) {
  matchStage.isAvailable = query.available === "true";
}

//build dynamic sort stage
const sortStage = {};
if (sort.startsWith("-")) {
  sortStage[sort.substring(1)] = -1;
} else {
  sortStage[sort] = 1;
}

const pipeline = [
  { $match: matchStage },
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
];

//category filter
if (query.category) {
  pipeline.push({
    $match: {
      "category.slug": query.category,
    },
  });
}

//supplier filter
if (query.supplier) {
  pipeline.push({
    $match: {
      "supplier.name": {
        $regex: query.supplier, //to all match query value ex: query.supplier = "app" result: apple,Apple Mac
        $options: "i", //case INSENSITIVE
      },
    },
  });
}

//project stage
pipeline.push({
  $project: {
    _id: 1,
    name: 1,
    slug: 1,
    price: 1,
    salePrice: 1,
    isAvailable: 1,
    category: {
      id: "$category._id",
      name: "$category.name",
      slug: "$category.slug",
    },
    supplier: {
      id: "$supplier._id",
      name: "$supplier.name",
    },
  },
});

//sorting stage
pipeline.push({
  $sort: sortStage,
});

//$facet stage (Run multiple mini-pipelines on the same dataset and return all results together.)
pipeline.push({
  $facet: {
    products: [
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ],
    pagination: [
      {
        $count: "total",
      },
    ],
  },
});


  return Product.aggregate(pipeline);
};

module.exports = {
  getProducts,
};
