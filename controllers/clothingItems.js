// const e = require("express");
// const ClothingItem = require("../models/clothingItem");
// const createItem = (req, res) => {
//   console.log(req);
//   console.log(req.body);

//   const { name, weather, imageURL } = req.body;

//   ClothingItem.create({ name, weather, imageURL })
//     .then((item) => {
//       res.send({ data: item });
//     })
//     .catch((err) => {
//       res.status(500).send({ message: "Error creating item", err });
//     });
// };

// module.exports = {
//   createItem,
// };

// updated code with added fields

const clothingItem = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL, owner } = req.body;

  const newItem = {
    name,
    weather,
    imageURL,
    owner, // Add the owner field to the new item??
    likes: [],
    createdAt: Date.now(),
  };

  ClothingItem.create(newItem)
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error creating item", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error getting items", err });
    });
};

const updateItem = (req, res) => {
  const { id } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(id, { $set: { imageURL } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      res.status(500).send({ message: "Error updating item", err });
    });
};

const deleteItem = (req, res) => {
  const { id } = req.params;
  console.log(id);

  ClothingItem.findByIdAndDelete(id)
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      res.status(500).send({ message: "Error deleting item", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
