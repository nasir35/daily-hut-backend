const { ObjectId } = require("mongodb");
const { createToken } = require("../middleware/jwtToken");
const { getDb } = require("../utils/dbConnect");

const findUserCollection = () => {
  const userCollection = getDb("userDB").collection("userCollection");
  return userCollection;
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const userCollection = findUserCollection();
    const users = await userCollection.find().toArray();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
module.exports.saveAnUser = async (req, res, next) => {
  try {
    const userCollection = findUserCollection();
    const user = req.body;
    const token = createToken(user);
    const isUserExist = await userCollection.findOne({ email: user?.email });

    if (isUserExist?._id) {
      return res
        .status(200)
        .json({ success: true, message: "Login success", data: token });
    }

    await userCollection.insertOne(user);
    return res
      .status(201)
      .json({ success: true, message: "Registration success", data: token });
  } catch (error) {
    console.error("Error saving user:", error);
    return res
      .status(500)
      .json({ success: true, message: "Error! Failed to create the user!" });
  }
};
module.exports.getUsersCount = async (req, res, next) => {
  try {
    const userCollection = findUserCollection();
    const adminsCount = (await userCollection.find({ role: "admin" }).toArray())
      .length;
    const membersCount = (
      await userCollection.find({ role: "member" }).toArray()
    ).length;
    const suppliersCount = (
      await userCollection.find({ role: "supplier" }).toArray()
    ).length;
    const data = { adminsCount, suppliersCount, membersCount };
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};
module.exports.getUserWithId = async (req, res, next) => {
  try {
    const userCollection = findUserCollection();
    const id = req.params.id;
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    res.status(200).json({
      success: true,
      data: user,
      message: "User found",
    });
  } catch (error) {
    next(error);
  }
};
module.exports.getUserWithEmail = async (req, res, next) => {
  try {
    const userCollection = findUserCollection();
    const email = req.params.email;
    const user = await userCollection.findOne({ email });
    res.status(200).json({
      success: true,
      data: user,
      message: "User found",
    });
  } catch (error) {
    next(error);
  }
};
module.exports.updateUserWithEmail = async (req, res, next) => {
  try {
    const userCollection = findUserCollection();
    const email = req.params.email;
    const userData = req.body;
    const result = await userCollection.updateOne(
      { email },
      { $set: userData },
      { upsert: true }
    );
    res.status(200).json({
      success: true,
      data: result,
      message: "User data updated",
    });
  } catch (error) {
    next(error);
  }
};
