const buildEmptyPaginationResponse = () => ({
        products : [],
        pagination: {
            total : 0
        }
});

module.exports = buildEmptyPaginationResponse;