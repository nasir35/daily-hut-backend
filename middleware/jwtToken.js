const jwt = require("jsonwebtoken");

// jwt setup
const secretKey = process.env.SECRET_KEY;

function createToken(user) {
  const token = jwt.sign(
    {
      email: user.email,
    },
    secretKey,
    { expiresIn: "7d" }
  );
  return token;
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, secretKey);
  if (!verify?.email) {
    return res.send("You are not authorized");
  }
  req.user = verify.email;
  next();
}

module.exports = { createToken, verifyToken };
