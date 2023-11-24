const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const User = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (!bearer || !token || bearer !== "Bearer") {
      return res.status(401).send("Not authorized");
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user || !user.token || user.token !== token) {
      return res.status(401).send("Not authorized");
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenExpiry = decodedToken.exp;

    const timeUntilExpiry = tokenExpiry - currentTimestamp;

    const timeThreshold = 60 * 10;
    if (timeUntilExpiry < timeThreshold) {
      const newToken = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: "23h",
      });

      user.token = newToken;
      await user.save();

      res.setHeader("Authorization", `Bearer ${newToken}`);
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Not authorized");
  }
};

module.exports = { auth };
