const Contact = require("../models/contacts");
const { updateStatusSchema } = require("../utils/validation/validation");

async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.find({ owner: req.user.id }).exec();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId).exec();

    if (!contact || contact.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  const { error } = updateStatusSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
    owner: req.user.id,
  };

  try {
    const result = await Contact.create(contact);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;

  const { error } = updateStatusSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner: req.user.id },
      contact,
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;

  try {
    const result = await Contact.findOneAndDelete({
      _id: contactId,
      owner: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner: req.user.id },
      contact,
      { new: true }
    );

    if (result === null) {
      return res.status(404).send("Contact not found");
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateStatusContact,
  removeContact,
  updateContact,
};
