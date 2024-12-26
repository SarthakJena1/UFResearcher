import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose from 'mongoose';
import crypto from 'crypto';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

const app = express();
const apiKey = '078fc03a4fca4bbfb9b852bdf080234d';
const apiSecret = 'e247f3052a21459bb31a329ebb2ceeff';

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB Atlas
const uri = "mongodb+srv://sarthakjena05:m7MqJULGGBm3ns8a@gatorresearch.g0l2t.mongodb.net/gatorresearch?retryWrites=true&w=majority&appName=GatorResearch";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Atlas connected successfully"))
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    savedArticles: [
        {
            title: String,
            date: String,
            authors: [String],
            departments: [String],
            fields: [String]
        },
    ]
});

const User = mongoose.model('User', userSchema);

// Verification transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gatorresearchtest@gmail.com',
        pass: 'blka fcyl stql uhcr'
    }
});

// HMAC-SHA256
function generateDigest(secret, data) {
    return crypto.createHmac('sha1', secret).update(data).digest('hex');
}

function createRequestURL({ q, timeframe, type, pages }) {
    const scope = 'institution';
    const filters = `q|${q}|scope|${scope}|timeframe|${timeframe}|type|${type}`;
    const digest = generateDigest(apiSecret, filters);
    const baseURL = 'https://www.altmetric.com/explorer/api/research_outputs?';

    const queryParams = new URLSearchParams({
        digest: digest,
        key: apiKey,
        'filter[q]': q,
        'filter[timeframe]': timeframe,
        'filter[type][]': type,
        'filter[scope]': 'institution',
        'filter[order]': 'publication_date',
        'page[number]': 1,
        'page[size]': pages
    });
    return baseURL + queryParams.toString();
}

function getAuthors(data) {
    const authors = {};
    data.forEach((item) => {
        if (item.type === 'author') {
            authors[item.id] = item.attributes.name;
        }
    });
    return authors;
}

function getDepartments(data) {
    const departments = {};
    data.forEach((item) => {
        if (item.type === 'department') {
            departments[item.id] = item.attributes.name;
        }
    });
    return departments;
}

function getFieldOfResearch(data) {
    const fields = {};
    data.forEach((item) => {
        if (item.type === 'field-of-research') {
            fields[item.id] = item.attributes.name;
        }
    });
    return fields;
}


/// Routes

// Register
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) return res.status(400).json({ message: "Username and password are required." });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists. Please log in." });

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashPass, verificationToken });
        await newUser.save();

        const verificationLink = `http://localhost:5001/verify?token=${verificationToken}`;
        await transporter.sendMail({
            from: 'ResearchGator <gatorresearchtest@gmail.com>',
            to: username,
            subject: 'Verify Your Email',
            text: `Click the link to verify: ${verificationLink}`
        });

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
});

// Verify Email
app.get("/verify", async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(400).send("Invalid or expired token");
        user.verified = true;
        user.verificationToken = null;
        await user.save();
        res.send("Email verified successfully!");
    } catch (err) {
        res.status(500).send("Error verifying email");
    }
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        if (!user.verified) return res.status(400).json({ message: "Account not verified." });
        const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
        res.json({ username: user.username, token });
    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// Saved Information
app.post("/save-article", async (req, res) => {
    const { username, article } = req.body;
    console.log("Request body:", req.body);
    try {
        if (!username || !article) {
            console.log("Missing username or article");
            return res.status(400).json({message: "Username and article are required"});
        }
        const user = await User.findOne({username});
        if (!user) {
            console.log("User not found:", username);
            return res.status(400).json({message: "User not found"});
        }
        // Check if article already saved
        const exists = user.savedArticles.some((savedArticle) => savedArticle.title === article.title);
        if (exists) {
            console.log("Article already saved:", article.title);
            return res.status(400).json({message: "Article already saved"});
        }
        user.savedArticles.push(article);
        await user.save();
        res.json({message: "Article saved successfully"});
    }
    catch (error) {
        console.error("Error saving article:", error.message);
        res.status(500).json({message: "Error saving article"});
    }
});

app.get("/saved-articles", async (req, res) => {
    const { username } = req.query;
    console.log("Fetching saved articles for:", username);
    try {
        const user = await User.findOne({username});
        if (!user) {
            console.log("User not found:", username);
            return res.status(400).json({message: "User not found"});
        }
        console.log("Saved articles:", user.savedArticles);
        res.json(user.savedArticles || []);
    }
    catch (error) {
        console.error("Error fetching saved articles:", error);
        res.status(500).json({message: "Error fetching saved articles"});
    }
});

app.delete("/unsave-article", async (req, res) => {
    const { username, articleTitle } = req.body;

    try {
        if (!username || !articleTitle) {
            console.log("Missing username or article title");
            return res.status(400).json({message: "Username and article title are required"});
        }
        const user = await User.findOne({username});
        if (!user) {
            console.log("User not found:", username);
            return res.status(400).json({message: "User not found"});
        }
        const initLength = user.savedArticles.length;
        user.savedArticles = user.savedArticles.filter((article) => article.title !== articleTitle);
        if (user.savedArticles.length === initLength) {
            console.log("Article not found:", articleTitle);
            return res.status(400).json({message: "Article not found"});
        }
        await user.save();
        res.json({message: "Article removed successfully"});
    }
    catch (error) {
        console.error("Error removing article:", error.message);
        res.status(500).json({message: "Error removing article"});
    }
});
// Search Route
app.post("/search", async (req, res) => {
    const { major, interests = [], page = 1 } = req.body;
    try {
        const q = major;
        const timeframe = 'at';
        const type = 'article';
        const pages = 20; // Display top 20 results

        const url = createRequestURL({ q, timeframe, type, pages });
        console.log("Generated URL:", url); // Debugging purpose

        const response = await fetch(`${url}&page[number]=${page}`);
        const data = await response.json();

        if (!data || !data.data) {
            console.error("Invalid API response:", data);
            return res.status(500).json({ message: "Invalid response from the Altmetric API" });
        }

        const authorMap = getAuthors(data.included || []);
        const departmentMap = getDepartments(data.included || []);
        const fieldMap = getFieldOfResearch(data.included || []);

        const fieldsOfInterest = Object.entries(fieldMap).map(([id, name]) => ({ id, name }));

        const results = data.data.map((item) => ({
            title: item.attributes?.title || 'N/A',
            date: item.attributes?.['publication-date'] || 'N/A',
            authors: item.relationships?.['institutional-authors']?.map((a) => authorMap[a.id]) || [],
            departments: item.relationships?.['institutional-departments']?.map((d) => departmentMap[d.id]) || [],
            fields: item.relationships?.['fields-of-research']?.map((f) => fieldMap[f.id]) || [],
        }));
        res.json({results, fieldsOfInterest});
    } catch (err) {
        console.error("Error during API call:", err.message);
        res.status(500).json({ message: "Error fetching suggestions. Please try again later." });
    }
});

// Start the server
const port = 5001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
