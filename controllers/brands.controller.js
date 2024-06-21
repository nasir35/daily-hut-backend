const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

const findBrandsCollection = () => {
  return getDb("brandsDB").collection("brandsCollection");
};

module.exports.getAllBrands = async (req, res, next) => {
  try {
    const BrandsCollection = findBrandsCollection();
    const brands = await BrandsCollection.find({}).toArray();
    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};
module.exports.addABrand = async (req, res, next) => {
  try {
    const BrandsCollection = findBrandsCollection();
    const brand = req.body;
    const result = await BrandsCollection.insertOne(brand);
    res.status(200).json({
      success: true,
      message: "Brand added successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports.editABrand = async (req, res, next) => {
  try {
    const BrandsCollection = findBrandsCollection();
    const { id } = req.params;
    const brand = req.body;
    const matchedbrand = await BrandsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (matchedbrand) {
      const result = await BrandsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: brand }
      );
      res.status(200).json({
        success: true,
        message: "Brand updated successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports.deleteABrand = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await findBrandsCollection().deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 1) {
      res.status(200).json({
        success: true,
        message: "Brand deleted successfully!",
        data: result,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "something went wrong!" });
    }
  } catch (error) {
    next(error);
  }
};
