const cacheKeys = require("./cache.keys");
const cacheService = require("./cache.service");

const invalidateProductDetail = async (slug) => {
    await cacheService.del(cacheKeys.product.detail(slug))
}

const invalidateProduct = async (slug) => {
  //console.log("invalidateProduct called");
    
  await Promise.all([
    cacheService.del(cacheKeys.product.detail(slug)),
    cacheService.delByPattern("product:list:*"),
  ]);
};


const invalidateInventoryCache = async ({previous,current}) => {
  if(previous.isAvailable !== current.isAvailable) {
    return invalidateProduct(current.slug);
  }else{
    return invalidateProductDetail(current.slug);
  }
}

module.exports = {
  invalidateProductDetail,
  invalidateProduct,
  invalidateInventoryCache
};
