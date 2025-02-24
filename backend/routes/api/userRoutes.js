import express from "express";
import User from "../../models/User.js";

const userRoutes = express.Router();

// Get all users
userRoutes.get("/", (req, res) => {
  res.json({ mssg: "GET ALL USERS" }); // Dummy
});

// Get a single user
userRoutes.get("/:id", (req, res) => {
  res.json({ mssg: "GET SINGLE USER" }); // Dummy
});

// POST a new user
userRoutes.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    res.status(200).json(user); // 200 means all good
  } catch (error) {
    res.status(400).json({ error: error.message }); // 400 means all bad
  }
});

// Delete a user
userRoutes.delete("/:id", (req, res) => {
  res.json({ mssg: "delete user" }); // Dummy
});

// Update a user
userRoutes.put("/:id", (req, res) => {
  res.json({ mssg: "update user" }); // Dummy
});

export default userRoutes;