const isPurchasable = product => {
  return (
    product.isAvailable &&
    product.availableQuantity > 0
  );
};

module.exports = {
  isPurchasable
};