import express from "express";
import User from "../../models/User.js";


const app = express();
const userRoutes = express.Router();
app.use(express.json()); //json data in body -middleware

// Get all users
userRoutes.get("/", (req, res) => {
  res.json({ mssg: "GET ALL USERS" }); // Dummy
});

// Get a single user
userRoutes.get("/:id", (req, res) => {
  res.json({ mssg: "GET SINGLE USER" }); // Dummy
});

// POST a new user
userRoutes.post("/users", async (req, res) => { //async so we can call await
  const user = req.body; //user sending data

  if(!user.name || !user.email || !user.password){//middleware
  return res.status(400).json({success:false, message: "Provide all fields"});
  }
  const newUser = new User(user);

  try{
  await newUser.save();
  res.status(201).json({success: true, data: newUser});//201 means something created

  }catch(error){
  console.log("Error in creating user :", error.message);
  res.status(500).json({success: false, message: "Server error"});
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