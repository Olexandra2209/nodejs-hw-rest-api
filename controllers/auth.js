// const bcrypt = require("bcrypt");

// const jwt = require("jsonwebtoken");

// const User = require("../models/users");

// async function register(req, res, next) {
//   const { email, password } = req.body;

//   try {
//     const { error } = validationSchema.validate({ email, password });

//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const user = await User.findOne({ email }).exec();

//     if (user !== null) {
//       return res.status(409).send({ message: "Email in use" });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);
//     const newUser = await User.create({ email, password: passwordHash });

//     res.status(201).send({
//       message: "Registration successfully!",
//       user: { email: newUser.email, subscription: newUser.subscription },
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// async function login(req, res, next) {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email }).exec();

//     if (user === null) {
//       return res.status(401).send({ message: "Email or password is wrong" });
//     }

//     const passwordCompare = await bcrypt.compare(password, user.password);

//     if (!passwordCompare) {
//       return res.status(401).send({ message: "Email or password is wrong" });
//     }

//     const payload = {
//       id: user._id,
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "23h",
//     });

//     res.send({
//       token,
//       user: {
//         email: user.email,
//         subscription: user.subscription,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// async function logout(req, res, next) {
//   try {
//     await User.findByIdAndUpdate(req.user.id, { token: null }).exec();

//     res.status(204).json({
//       message: "No content",
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// module.exports = { register, login, logout };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/users");
const Joi = require("joi");

const validationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// async function register(req, res, next) {
//   const { password, email, subscription } = req.body;

//   try {
//     const user = await User.findOne({ email }).exec();

//     if (user) {
//       return res.status(409).json({ message: "Email in use" });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);

//     await User.create({ email, subscription, password: passwordHash });

//     res.status(201).json({
//       user: { email: email, subscription: subscription },
//     });
//   } catch (error) {
//     next(error);
//   }
// }

async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const { error } = validationSchema.validate({ email, password });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email }).exec();

    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: passwordHash });

    res.status(201).send({
      message: "Registration successfully!",
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (user === null) {
      console.log(user);
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("PASSWORD");
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    await User.findByIdAndUpdate(user._id, { token }).exec();

    res.send({ token });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }).exec();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  const authHeader = req.headers.authorization;
  const [bearer, token] = authHeader.split(" ", 2);

  console.log({ bearer, token });

  try {
    const user = await User.findOne({ token }).exec();

    if (user === null) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, current };
