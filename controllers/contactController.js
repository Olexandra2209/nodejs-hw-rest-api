const Contact = require("../models/contacts");

const Joi = require("joi");

const updateStatusSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  favorite: Joi.boolean().required().error(new Error("Missing field favorite")),
});

async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.find().exec();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
}
async function getContactById(req, res, next) {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId).exec();

    if (contact === null) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
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

  try {
    const validationResult = updateStatusSchema.validate(req.body, {
      abortEarly: false,
    });

    if (validationResult.error) {
      const errorMessage = validationResult.error.message;
      return res.status(400).json({ message: errorMessage });
    }

    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
    };

    const result = await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });

    if (result === null) {
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
    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) {
      res.status(404).json({ message: "Not found" });
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
    const result = await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });

    if (result === null) {
      return res.status(404).send("Contact not found");
    }

    res.send(result);
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
