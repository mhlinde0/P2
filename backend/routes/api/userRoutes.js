import express from "express";

import {getAllUsers, getUser, createUser, deleteUser} from "../../controllers/userController.js";

//const app = express();

const userRoutes = express.Router();

//app.use(express.json()); //json data in body -middleware


// Get all users
userRoutes.get("/", getAllUsers);

// Get a single user
userRoutes.get("/:id", getUser);

// POST a new user
userRoutes.post("/", createUser);

// Delete a user
userRoutes.delete("/:id", deleteUser);

/*
// Update a user
userRoutes.put("/:id", (req, res) => {
  res.json({ mssg: "update user" }); // Dummy
});
*/
export default userRoutes;