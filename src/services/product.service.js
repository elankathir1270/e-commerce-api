const productRepository = require("./../repositories/product.repository");
const ApiError = require("./../utils/apiError");

const cacheKeys = require("./../cache/cache.keys");
const cacheService = require("./../cache/cache.service");
const CACHE_TTL = require("./../cache/cache.ttl");
const { invalidateProduct } = require("../cache/cache.invalidation");

const getProducts = async (query) => {
   // Generate Cache Key
   const cacheKey = cacheKeys.product.list(query);

   // Check cache
   const cachedProducts = await cacheService.get(cacheKey);
   if(cachedProducts) {
    //console.log("Product List Cache Hit");
    return cachedProducts;
   }

   // Fetch from MongoDB
  //console.log("Product List Cache Miss");
  const products = await productRepository.getProducts(query);

  // Store Cache
  await cacheService.set({
    key: cacheKey, value: products, ttlInSeconds: CACHE_TTL.PRODUCT_LIST
  })

  return products;
};

const getProductBySlug = async (slug) => {
  // Generate Cache Key
  const cacheKey = cacheKeys.product.detail(slug);

  // Check cache
  const cachedProduct = await cacheService.get(cacheKey);
   if(cachedProduct) {
    console.log("Product detail Cache Hit");
    return cachedProduct;
   }
  
  // Fetch from MongoDB
  console.log("Product Detail Cache Miss"); 
  const product = await productRepository.getProductBySlug(slug);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Store Cache
  await cacheService.set({
    key: cacheKey, value: product, ttlInSeconds: CACHE_TTL.PRODUCT_DETAIL
  })

  return product;
};


const updateProduct = async (id, payload) => {
  // Check whether the product exists
  const existingProduct = await productRepository.getProductById(id);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const effectivePrice =
    payload.price ?? existingProduct.price;

  const effectiveSalePrice =
    payload.salePrice ??
    existingProduct.salePrice;

  if (
    effectiveSalePrice !== undefined &&
    effectiveSalePrice > effectivePrice
  ) {
    throw new ApiError(
      400,
      "Sale price cannot be greater than price."
    );
  }

  // Update product
  const updatedProduct = await productRepository.updateProduct(id, payload);

  //cache invalidate
  await invalidateProduct(existingProduct.slug);

  return updatedProduct;
};

module.exports = {
  getProducts,
  getProductBySlug,
  updateProduct
};
