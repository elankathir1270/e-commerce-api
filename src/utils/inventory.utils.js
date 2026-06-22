const calculateAvailableQuantity = (quality, reservedQuantity) => {
    return Math.max(quality - reservedQuantity, 0)
}

module.exports = { calculateAvailableQuantity }