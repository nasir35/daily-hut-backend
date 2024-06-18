const jwt = require("jsonwebtoken");
const { getDb } = require("../utils/dbConnect");

const secretKey = process.env.SECRET_KEY;

async function verifyAdminOrSupplier(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, secretKey);
    const email = verify.email;
    const user = await getDb("userDB")
      .collection("userCollection")
      .findOne({ email });
    if (user?.role === "admin" || user?.role === "supplier") {
      next();
    } else {
      return res.status(400).send({
        success: false,
        message: "Error! You are not authorized!!",
      });
    }
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

module.exports = verifyAdminOrSupplier;
