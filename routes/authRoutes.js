const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const SECRET = "supersecret";

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashed });
   res.render("login"); 
    // res.json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, username }, SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.cookie("username", username, { httpOnly: false });
    res.render("chat", { username }); 
});

module.exports = router;