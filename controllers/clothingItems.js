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
const ERROR_CODES = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  const newItem = {
    name,
    weather,
    imageUrl,
    owner: req.user._id,
    likes: [],
    createdAt: Date.now(),
  };

  // ClothingItem.create(newItem)
  //   .then((item) => {
  //     res.send({ data: item });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: "Error creating item", err });
  //   });

  ClothingItem.create(newItem)
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: "Invalid data passed" });
      } else {
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "Error creating item" });
      }
    });
};

// start new code getItems

// const getItems = (req, res) => {
//   ClothingItem.find({})
//     .then((items) => {
//       res.status(200).send({ data: items });
//     })
//     .catch((err) => {
//       res.status(500).send({ message: "Error getting items", err });
//     });
// };

// old getItems code

// const getItems = (req, res) => {
//   ClothingItem.findById(req.params.id)
//     .orFail(() => {
//       const error = new Error("Clothing item not found");
//       error.statusCode = ERROR_CODES.NOT_FOUND;
//       throw error;
//     })
//     .then((item) => res.send(item))
//     .catch((err) => {
//       console.error(err);
//       res
//         .status(err.statusCode || ERROR_CODES.SERVER_ERROR)
//         .send({ message: err.message || "An error has occurred" });
//     });
// };

// const getItems = (req, res) => {
//   ClothingItem.findById(req.params.id)
//     .then((item) => {
//       if (!item) {
//         res.status(200).send([]);
//         return;
//       }

//       res.send(item);
//     })
//     .catch((err) => {
//       console.error(err);
//       res
//         .status(err.statusCode || ERROR_CODES.SERVER_ERROR)
//         .send({ message: err.message || "An error has occurred" });
//     });
// };

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred" });
    });
};

// end updated getItems code

// start new code updateItem

// const updateItem = (req, res) => {
//   const { id } = req.params;
//   const { imageURL } = req.body;

//   ClothingItem.findByIdAndUpdate(id, { $set: { imageURL } }, { new: true })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((err) => {
//       res.status(500).send({ message: "Error updating item", err });
//     });
// };

// const updateItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   })
//     .orFail(() => {
//       const error = new Error("Clothing item not found");
//       error.statusCode = ERROR_CODES.NOT_FOUND;
//       throw error;
//     })
//     .then((updatedItem) => res.send(updatedItem))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         res
//           .status(ERROR_CODES.INVALID_DATA)
//           .send({ message: "Invalid update data" });
//       } else {
//         res
//           .status(err.statusCode || ERROR_CODES.SERVER_ERROR)
//           .send({ message: err.message || "An error has occurred" });
//       }
//     });
// };

// code not needed for this project

const deleteItem = (req, res) => {
  const { id } = req.params;
  console.log(id);

  ClothingItem.findByIdAndDelete(id)
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: "Invalid ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }

      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "Error deleting item" });
    });
};

// old likeItem code

// const likeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.id,
//     { $addToSet: { likes: req.user._id } }, // Add _id to the array if it's not there yet
//     { new: true },
//   )
//     .then((item) => res.json(item))
//     .catch((err) =>
//       res.status(500).json({ message: "An error occurred", error: err }),
//     );
// };

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("DocumentNotFoundError"))
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.message === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .json({ message: "Invalid ID format" });
      }

      res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "An error occurred" });
    });
};

// old dislikeItem code

// const dislikeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.id,
//     { $pull: { likes: req.user._id } }, // Remove _id from the array
//     { new: true },
//   )
//     .then((item) => res.json(item))
//     .catch((err) =>
//       res.status(500).json({ message: "An error occurred", error: err }),
//     );
// };

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("DocumentNotFoundError"))
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.message === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .json({ message: "Invalid ID format" });
      }

      res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "An error occurred" });
    });
};

module.exports = {
  createItem,
  getItems,
  // updateItem, code not needed for this project
  deleteItem,
  likeItem,
  dislikeItem,
};
