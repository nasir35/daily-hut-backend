const { ObjectId } = require("mongodb");
const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};
async function verifyObjectId(req, res, next) {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = verifyObjectId;
