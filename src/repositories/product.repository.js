const Product = require("./../models/product.model");
const Category = require("./../models/category.model");
const Supplier = require("./../models/supplier.model");
const emptyPaginationResponse = require("./../utils/emptyPaginationResponse");

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

  if (query.available !== undefined) {
    matchStage.isAvailable = query.available === "true";
  }

  //category optimization
  if (query.category) {
    const category = await Category.findOne({
      slug: query.category,
    }).select("_id");
    if (!category) {
      return emptyPaginationResponse();
    }

    matchStage.categoryId = category._id;
  }

  //supplier optimization
  if (query.supplier) {
    const supplier = await Supplier.findOne({
      name: {
        $regex: query.supplier, //to all match query value ex: query.supplier = "app" result: apple,Apple Mac
        $options: "i",//case INSENSITIVE
      },
    }).select("_id");
    if (!supplier) {
      return emptyPaginationResponse();
    }

    matchStage.supplierId = supplier._id;
  }

  //price range filter
  if (query.minPrice || query.maxPrice) {
    matchStage.price = {};
  }
  //minimum price
  if (query.minPrice) {
    matchStage.price.$gte = Number(query.minPrice);
  }
  //maximum price
  if (query.maxPrice) {
    matchStage.price.$lte = Number(query.maxPrice);
  }

  //search filter
  if (query.search) {
    matchStage.$text = {
      $search: query.search,
    };
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
        let: { categoryId: "$categoryId" },

        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$categoryId"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              slug: 1,
            },
          },
        ],
        as: "category",
      },
    },
    {
      $lookup: {
        from: "suppliers",
        let: { supplierId: "$supplierId" },

        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$supplierId"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "supplier",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$supplier",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];


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

  //return Product.aggregate(pipeline);
  const result = await Product.aggregate(pipeline);

  const products = result[0]?.products || [];

  const total = result[0]?.pagination?.[0]?.total || 0;

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProductBySlug = async (slug) => {
  const result = await Product.aggregate([
    {
      $match: {
        slug,
        status: "ACTIVE",
      },
    },
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
        salePrice: 1,

        quantity: 1,

        isAvailable: 1,

        brand: 1,

        shortDescription: 1,
        description: 1,

        images: 1,

        specifications: 1,

        createdAt: 1,
        updatedAt: 1,

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
    },
  ]);
  const product = result[0] || null;
  return product;
};

module.exports = {
  getProducts,
  getProductBySlug,
};
