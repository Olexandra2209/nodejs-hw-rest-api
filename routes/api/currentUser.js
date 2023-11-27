// const express = require("express");
// const router = express.Router();

// const auth = require("../../middleware/auth");
// const User = require("../../models/users");

// router.get("/current", auth, async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.user._id);

//     if (!currentUser) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     res.status(200).json({
//       email: currentUser.email,
//       subscription: currentUser.subscription,
//     });
//   } catch (error) {
//     res.status(401).json({ message: "Not authorized" });
//   }
// });

// module.exports = router;
