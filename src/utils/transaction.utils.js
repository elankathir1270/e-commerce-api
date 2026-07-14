const mongoose = require("mongoose");

const withTransaction = async (callback) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const result = await callback(session);

        await session.commitTransaction();

        return result;
    }catch(error){
        session.abortTransaction();
        throw error
    }finally {
        session.endSession();
    }
}

module.exports = {
  withTransaction,
};