const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Sign Up
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("name, email, password", name, email, password)

    const existingUser = await User.findOne({ email });

    console.log("existingUser---------->", existingUser)

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Sign In

authRouter.post("/api/signin", async (req, res) => {
  try {
    // Log the entire request body and headers to see the incoming data
    console.log("Incoming request body:", req.body);
    console.log("Request headers:", req.headers);

    const { email, password } = req.body;
    
    // Log email and password for clarity (make sure not to log passwords in production)
    console.log("email, password--->", email, password);

    const user = await User.findOne({ email });
    
    // Log if user is found or not
    console.log("user,--->", user);

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    
    // Log password matching result
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    // Generate token and log it
    const token = jwt.sign({ id: user._id }, "passwordKey");
    console.log("Generated token:", token);

    // Respond with the token and user data
    res.json({ token, ...user._doc });
  } catch (e) {
    // Log the error details
    console.error("Error occurred:", e);
    res.status(500).json({ error: e.message });
  }
});


authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user data
authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

module.exports = authRouter;
