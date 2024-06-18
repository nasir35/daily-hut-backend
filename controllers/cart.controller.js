const jwt = require("jsonwebtoken");
const { getDb } = require("../utils/dbConnect");

const findCartCollection = () => {
  const cartCollection = getDb("cartDB").collection("cartCollection");
  return cartCollection;
};

const getUserEmail = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.SECRET_KEY);
  const email = verify.email;
  return email;
};

module.exports.getCart = async (req, res, next) => {
  try {
    const cartCollection = findCartCollection();
    const cart = await cartCollection.find().toArray();
    return res.status(200).send({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
module.exports.addToCart = async (req, res, next) => {
  try {
    const cartCollection = findCartCollection();
    const cartDetails = req.body;
    const email = getUserEmail(req);
    const cart = {
      cartFor: email,
      cartDetails,
    };
    const result = await cartCollection.insertOne(cart);
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
module.exports.editCart = async (req, res, next) => {
  try {
    const cartCollection = findCartCollection();
    const cart = req.body;
    const email = getUserEmail(req);
    const result = await cartCollection.updateOne(
      { cartFor: email },
      { $set: { cartDetails: cart } },
      { upsert: true }
    );
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
module.exports.checkIfExist = async (req, res, next) => {
  try {
    const email = getUserEmail(req);
    const cartCollection = findCartCollection();
    const result = await cartCollection.findOne({ cartFor: email });
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
