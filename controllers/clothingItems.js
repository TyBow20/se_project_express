// const ClothingItem = require("../models/clothingItem");
// const ERROR_CODES = require("../utils/errors");

// const createItem = (req, res) => {
//   console.log(req);
//   console.log(req.body);

//   const { name, weather, imageUrl } = req.body;

//   const newItem = {
//     name,
//     weather,
//     imageUrl,
//     owner: req.user._id,
//     likes: [],
//     createdAt: Date.now(),
//   };

//   ClothingItem.create(newItem)
//     .then((item) => {
//       res.send({ data: item });
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         res
//           .status(ERROR_CODES.INVALID_DATA)
//           .send({ message: "Invalid data passed" });
//       } else {
//         res
//           .status(ERROR_CODES.SERVER_ERROR)
//           .send({ message: "Error creating item" });
//       }
//     });
// };

// const getItems = (req, res) => {
//   ClothingItem.find()
//     .then((items) => {
//       res.send(items);
//     })
//     .catch((err) => {
//       console.error(err);
//       res
//         .status(ERROR_CODES.SERVER_ERROR)
//         .send({ message: "An error has occurred" });
//     });
// };

// // start new code updateItem

// // const updateItem = (req, res) => {
// //   const { id } = req.params;
// //   const { imageURL } = req.body;

// //   ClothingItem.findByIdAndUpdate(id, { $set: { imageURL } }, { new: true })
// //     .orFail()
// //     .then((item) => res.status(200).send({ data: item }))
// //     .catch((err) => {
// //       res.status(500).send({ message: "Error updating item", err });
// //     });
// // };

// // const updateItem = (req, res) => {
// //   ClothingItem.findByIdAndUpdate(req.params.id, req.body, {
// //     new: true,
// //     runValidators: true,
// //   })
// //     .orFail(() => {
// //       const error = new Error("Clothing item not found");
// //       error.statusCode = ERROR_CODES.NOT_FOUND;
// //       throw error;
// //     })
// //     .then((updatedItem) => res.send(updatedItem))
// //     .catch((err) => {
// //       console.error(err);
// //       if (err.name === "ValidationError") {
// //         res
// //           .status(ERROR_CODES.INVALID_DATA)
// //           .send({ message: "Invalid update data" });
// //       } else {
// //         res
// //           .status(err.statusCode || ERROR_CODES.SERVER_ERROR)
// //           .send({ message: err.message || "An error has occurred" });
// //       }
// //     });
// // };

// // code not needed for this project
// const deleteItem = (req, res) => {
//   const { id } = req.params;

//   ClothingItem.findById(id)
//     .then((item) => {
//       if (!item) {
//         return res
//           .status(ERROR_CODES.NOT_FOUND)
//           .send({ message: "Item not found" });
//       }

//       if (item.owner.toString() !== req.user._id.toString()) {
//         return res
//           .status(ERROR_CODES.FORBIDDEN)
//           .send({ message: "Not authorized to delete this item" });
//       }

//       return item.remove().then(() => {
//         res.status(200).send({ message: "Item deleted successfully" });
//       });
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         res
//           .status(ERROR_CODES.INVALID_DATA)
//           .send({ message: "Invalid ID format" });
//       } else {
//         console.error(err);
//         res
//           .status(ERROR_CODES.SERVER_ERROR)
//           .send({ message: "Error deleting item" });
//       }
//     });
// };

// const likeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.id,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(new Error("DocumentNotFoundError"))
//     .then((item) => res.json(item))
//     .catch((err) => {
//       if (err.message === "DocumentNotFoundError") {
//         return res
//           .status(ERROR_CODES.NOT_FOUND)
//           .json({ message: "Item not found" });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(ERROR_CODES.INVALID_DATA)
//           .json({ message: "Invalid ID format" });
//       }

//       res
//         .status(ERROR_CODES.SERVER_ERROR)
//         .json({ message: "An error occurred" });
//     });
// };

// // old dislikeItem code

// // const dislikeItem = (req, res) => {
// //   ClothingItem.findByIdAndUpdate(
// //     req.params.id,
// //     { $pull: { likes: req.user._id } }, // Remove _id from the array
// //     { new: true },
// //   )
// //     .then((item) => res.json(item))
// //     .catch((err) =>
// //       res.status(500).json({ message: "An error occurred", error: err }),
// //     );
// // };

// const dislikeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.id,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(new Error("DocumentNotFoundError"))
//     .then((item) => res.json(item))
//     .catch((err) => {
//       if (err.message === "DocumentNotFoundError") {
//         return res
//           .status(ERROR_CODES.NOT_FOUND)
//           .json({ message: "Item not found" });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(ERROR_CODES.INVALID_DATA)
//           .json({ message: "Invalid ID format" });
//       }

//       res
//         .status(ERROR_CODES.SERVER_ERROR)
//         .json({ message: "An error occurred" });
//     });
// };

// module.exports = {
//   createItem,
//   getItems,
//   // updateItem, code not needed for this project
//   deleteItem,
//   likeItem,
//   dislikeItem,
// };

const ClothingItem = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");

const createItem = (req, res, next) => {

  const { name, weather, imageUrl } = req.body;

  const newItem = {
    name,
    weather,
    imageUrl,
    owner: req.user._id,
    likes: [],
    createdAt: Date.now(),
  };

  ClothingItem.create(newItem)
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = ERROR_CODES.INVALID_DATA;
        err.message = "Invalid data passed";
      } else {
        err.statusCode = ERROR_CODES.SERVER_ERROR;
        err.message = "Error creating item";
      }
      next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find()
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      err.statusCode = ERROR_CODES.SERVER_ERROR;
      err.message = "An error has occurred";
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { id } = req.params;

  ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found");
        error.statusCode = ERROR_CODES.NOT_FOUND;
        throw error;
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        const error = new Error("Not authorized to delete this item");
        error.statusCode = ERROR_CODES.FORBIDDEN;
        throw error;
      }

      return item.remove().then(() => {
        res.status(200).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = ERROR_CODES.INVALID_DATA;
        err.message = "Invalid ID format";
      } else {
        err.statusCode = ERROR_CODES.SERVER_ERROR;
        err.message = "Error deleting item";
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("DocumentNotFoundError"))
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.message === "DocumentNotFoundError") {
        err.statusCode = ERROR_CODES.NOT_FOUND;
        err.message = "Item not found";
      } else if (err.name === "CastError") {
        err.statusCode = ERROR_CODES.INVALID_DATA;
        err.message = "Invalid ID format";
      } else {
        err.statusCode = ERROR_CODES.SERVER_ERROR;
        err.message = "An error occurred";
      }
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("DocumentNotFoundError"))
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.message === "DocumentNotFoundError") {
        err.statusCode = ERROR_CODES.NOT_FOUND;
        err.message = "Item not found";
      } else if (err.name === "CastError") {
        err.statusCode = ERROR_CODES.INVALID_DATA;
        err.message = "Invalid ID format";
      } else {
        err.statusCode = ERROR_CODES.SERVER_ERROR;
        err.message = "An error occurred";
      }
      next(err);
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
