import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(cors(
    { origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
app.use(express.json());

// Connect to MongoDB Atlas
const uri = "mongodb+srv://sarthakjena05:m7MqJULGGBm3ns8a@gatorresearch.g0l2t.mongodb.net/?retryWrites=true&w=majority&appName=GatorResearch";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Atlas connected successfully"))
    .catch((err) => console.error("MongoDB connection failed:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Register Route
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashPass });
        await newUser.save();
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// Start the server
const port = 5001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
