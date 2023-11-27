// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const { JWT_SECRET } = process.env;
// const User = require("../models/users");

// const auth = async (req, res, next) => {
//   try {
//     const { authorization = "" } = req.headers;
//     const [bearer, token] = authorization.split(" ");

//     if (!bearer || !token || bearer !== "Bearer") {
//       return res.status(401).send("Not authorized");
//     }

//     const decodedToken = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decodedToken.id);

//     if (!user || !user.token || user.token !== token) {
//       return res.status(401).send("Not authorized");
//     }

//     const currentTimestamp = Math.floor(Date.now() / 1000);
//     const tokenExpiry = decodedToken.exp;

//     const timeUntilExpiry = tokenExpiry - currentTimestamp;

//     const timeThreshold = 60 * 10;
//     if (timeUntilExpiry < timeThreshold) {
//       const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "23h",
//       });

//       user.token = newToken;
//       await user.save();

//       res.setHeader("Authorization", `Bearer ${newToken}`);
//     }

//     req.user = { id: user._id };
//     next();
//   } catch (error) {
//     res.status(401).send("Not authorized");
//   }
// };

// module.exports = { auth };

const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token" });
  }

  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }

    try {
      req.user = decode;

      const user = await User.findById(decode.id).exec();

      if (!user || user.token !== token) {
        return res.status(401).send({ message: "Not authorized" });
      }

      req.user = { id: user._id, email: user.email };

      next();
    } catch (error) {
      next(error);
    }
  });
}

module.exports = auth;
