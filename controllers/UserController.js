const fs = require("node:fs/promises");
const path = require("path");

const User = require("../models/users");
const Jimp = require("jimp");

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id).exec();

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatarURL === null || user.avatarURL === undefined) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(
      path.join(
        __dirname,
        "..",
        "public/avatars",
        path.basename(user.avatarURL)
      )
    );
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    await fs.rename(
      req.file.path,
      path.join(__dirname, "..", "public/avatars", req.file.filename)
    );

    const uploadedImage = await Jimp.read(
      path.join(__dirname, "..", "public/avatars", req.file.filename)
    );

    uploadedImage.resize(250, 250);

    const newImagePath = path.join(
      __dirname,
      "..",
      "public/avatars",
      req.file.filename
    );

    await uploadedImage.writeAsync(newImagePath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename, avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    ).exec();

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAvatar, uploadAvatar };
