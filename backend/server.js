const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/NoteApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1);
});

// Middleware
app.use(express.json());

// Define the schema
const UserSchema = new mongoose.Schema({
  body: String,
  check: Boolean,
  renaming: Boolean
});

// Create a model
const UserModel = mongoose.model("users", UserSchema);

// Define routes
app.post("/addUser", async (req, res) => {
  try {
    const { body, check, renaming } = req.body;
    const newUser = new UserModel({ body, check, renaming });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route handler for the root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the NoteApp API!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
