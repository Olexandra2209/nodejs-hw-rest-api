const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const validationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

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
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "23h",
    });

    res.send({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }).exec();

    res.status(204).json({
      message: "No content",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout };
