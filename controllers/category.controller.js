const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

const findCategoryCollection = () => {
  return getDb("categoryDB").collection("categories");
};

module.exports.getAllCategory = async (req, res, next) => {
  try {
    const categoryCollection = findCategoryCollection();
    const categories = await categoryCollection.find({}).toArray();
    res.status(200).json({
      success: true,
      msg: "categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
module.exports.addACategory = async (req, res, next) => {
  try {
    const categoryCollection = findCategoryCollection();
    const category = req.body;
    const result = await categoryCollection.insertOne(category);
    res.status(200).json({
      success: true,
      msg: "category added successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports.editACategory = async (req, res, next) => {
  try {
    const categoryCollection = findCategoryCollection();
    const { id } = req.params;
    const category = req.body;
    const matchedCategory = await categoryCollection.findOne({
      _id: new ObjectId(id),
    });
    if (matchedCategory.length) {
      const result = await categoryCollection.patch(
        { _id: new ObjectId(id) },
        { $set: category }
      );
      res.status(200).json({
        success: true,
        msg: "category updated successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports.deleteACategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await findCategoryCollection().deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 1) {
      res.status(200).json({
        success: true,
        msg: "category deleted successfully!",
        data: result,
      });
    } else {
      res.status(400).json({ success: false, msg: "something went wrong!" });
    }
  } catch (error) {
    next(error);
  }
};
module.exports.getSubCategories = async (req, res, next) => {
  try {
    const id = req.params.categoryId;
    const category = await findCategoryCollection().findOne({
      _id: new ObjectId(id),
    });
    res.status(200).send({ success: true, data: category.subCategories });
  } catch (error) {
    res
      .status(400)
      .send({ success: false, msg: "No category found with this id" });
  }
};
