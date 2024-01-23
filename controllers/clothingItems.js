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

module.exports = {
  createItem,
};
