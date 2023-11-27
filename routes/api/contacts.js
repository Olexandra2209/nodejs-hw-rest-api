const express = require("express");

const router = express.Router();
const jsonParser = express.json();

const ContactController = require("../../controllers/contactController");
const auth = require("../../middleware/auth");

router.get("/", auth, ContactController.listContacts);

router.get("/:contactId", auth, ContactController.getContactById);

router.post("/", jsonParser, auth, ContactController.addContact);

router.delete("/:contactId", auth, ContactController.removeContact);

router.put("/:id", jsonParser, auth, ContactController.updateContact);

router.put(
  "/:contactId/favorite",
  jsonParser,
  auth,
  ContactController.updateStatusContact
);

module.exports = router;
