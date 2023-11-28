const jwt = require("jsonwebtoken");
const User = require("../models/users");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Authorization header is missing" });
  }

  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer" || !token) {
    return res.status(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }

    try {
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
