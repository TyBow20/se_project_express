// const e = require("express");
const ClothingItem = require("../models/clothingItem");
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
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
