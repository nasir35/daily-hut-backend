const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

const findProductsCollection = () => {
  const productsCollection =
    getDb("productsDB").collection("productsCollection");
  return productsCollection;
};

module.exports.getAllProducts = async (req, res, next) => {
  try {
    let filters = { ...req.query };
    let queries = req.query;
    queries.sort = queries?.sort?.split(",").join(" ");
    const excludeFields = ["limit", "page", "sort"];
    excludeFields.forEach((field) => delete filters[field]);

    const currentPage = parseInt(req.query?.page) || 1;
    const pageSize = 20;
    const skipValue = (currentPage - 1) * pageSize;

    queries.limit = parseInt(queries?.limit) || pageSize;
    const products = await findProductsCollection()
      .find(filters)
      .limit(queries.limit)
      .skip(skipValue)
      .sort(queries.sort)
      .toArray();
    const totalProducts = await findProductsCollection().countDocuments(
      filters
    );
    res.status(200).json({
      success: true,
      totalProducts,
      data: products,
      msg: "Products fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch products" });
  }
};

module.exports.getProductById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const product = await findProductsCollection().findOne({
      _id: new ObjectId(id),
    });
    if (product) {
      res.status(200).send({ success: true, data: product });
    } else {
      res.status(404).send({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ error: "Failed to fetch product" });
  }
};
module.exports.saveAProduct = async (req, res, next) => {
  try {
    const product = req.body;
    const category = req.body.category;
    const result = await findProductsCollection().insertOne(product);
    await getDb("categoryDB")
      .collection("categories")
      .updateOne({ name: category }, { $inc: { itemsCount: 1 } });
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    console.error("Error Adding product:", error);
    res.status(500).send({ error: "Failed to add product" });
  }
};
module.exports.editAProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const findProduct = await findProductsCollection().findOne({
      _id: new ObjectId(id),
    });
    if (findProduct.length) {
      const dataToUpdate = req.body;
      const result = await findProductsCollection().updateOne(
        { _id: new ObjectId(id) },
        { $set: dataToUpdate },
        { upsert: true }
      );
      res
        .status(200)
        .send({ success: true, data: result, msg: "product updated!" });
    } else {
      res
        .status(404)
        .json({ success: false, msg: "No matched product found to update!" });
    }
  } catch (error) {
    console.error("Error Updating product:", error);
    res.status(500).send({ error: "Failed to update product" });
  }
};

module.exports.deleteAProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const findProduct = await findProductsCollection().findOne({
      _id: new ObjectId(id),
    });
    if (findProduct.length) {
      const result = await findProductsCollection().deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).json({
          success: true,
          msg: "Product deleted successfully!",
          data: result,
        });
      } else {
        res.status(400).json({
          success: false,
          msg: "something went wrong while trying to delete the product!",
        });
      }
    } else {
      res.status(404).json({ success: false, msg: "Product not found." });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.searchProducts = async (req, res, next) => {
  try {
    let { search, limit } = req.query;
    limit = parseInt(limit) || 20;

    // Constructing the search filter
    let searchFilter = {};
    if (search) {
      const searchRegex = new RegExp(search, "i"); // case-insensitive search
      searchFilter = {
        $or: [
          { name: searchRegex },
          { category: searchRegex },
          { brand: searchRegex },
          { subcategory: { $elemMatch: { value: searchRegex } } },
        ],
      };
    }

    // Fetching products based on search criteria
    let products = await findProductsCollection()
      .find(searchFilter)
      .limit(limit)
      .toArray();

    // Ensuring uniqueness
    const uniqueProducts = [];
    const productIds = new Set();
    for (const product of products) {
      if (!productIds.has(product._id.toString())) {
        uniqueProducts.push(product);
        productIds.add(product._id.toString());
      }
    }

    // Fetch total number of matching products
    const totalProducts = await findProductsCollection().countDocuments(
      searchFilter
    );

    res.status(200).json({
      success: true,
      totalProducts,
      data: uniqueProducts,
      msg: "Products fetched successfully!",
    });
  } catch (error) {
    next(error);
  }
};
