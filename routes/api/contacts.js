const express = require("express");

const router = express.Router();

const jsonParser = express.json();

const ContactController = require("../../controllers/contactContoller");

router.get("/", ContactController.listContacts);

router.get("/:contactId", ContactController.getContactById);

router.post("/", jsonParser, ContactController.addContact);

router.delete("/:contactId", ContactController.removeContact);

router.put("/:id", jsonParser, ContactController.updateContact);

router.put(
  "/:contactId/favorite",
  jsonParser,
  ContactController.updateStatusContact
);

module.exports = router;
