const calculateAvailableQuantity = (quality, reservedQuantity) => {
    return Math.max(quality - reservedQuantity, 0)
}

const createInventorySnapshot = (product) => ({
    quantity: product.quantity,
    reservedQuantity: product.reservedQuantity,
    availableQuantity: product.availableQuantity,
    isAvailable: product.isAvailable
});

module.exports = { calculateAvailableQuantity,createInventorySnapshot }