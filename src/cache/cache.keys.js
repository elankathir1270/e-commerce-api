const crypto = require("crypto");

const hasObject = (object) => {
    const sortedObject  = Object.keys(object).sort()
    .reduce((result,key)=> {
        result[key] = object[key]

        return result
    },{})

    return crypto.createHash("sha256")
            .update(JSON.stringify(sortedObject))
            .digest("hex");
}

const cacheKeys = {
    product : {
        list(query) {
            return `product:list:${hasObject(query)}`
        },
        detail(slug) {
            return `product:detail:${slug}`
        }
    },
    category: {
        list() {
            return `category:list`

        }
    },
    supplier: {
        list() {
            return `supplier:list`
        }
    }
}

module.exports = cacheKeys;