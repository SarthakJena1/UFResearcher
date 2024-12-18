import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose from 'mongoose';
import crypto from 'crypto';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

const app = express();
const apiKey = '078fc03a4fca4bbfb9b852bdf080234d'
const apiSecret = 'e247f3052a21459bb31a329ebb2ceeff'

// Middleware
app.use(cors(
    { origin: 'http://localhost:3000',
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
    verificationToken: { type: String }
});

const User = mongoose.model('User', userSchema);

// verification transporter
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

// api requests
function createRequestURL({ q, timeframe, type, pages }) {
    const scope = 'institution';
    const filters = `q|${q}|scope|${scope}|timeframe|${timeframe}|type|${type}`;
    const digest = generateDigest(apiSecret, filters);
    const baseURL = 'https://www.altmetric.com/explorer/api/research_outputs?'

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
// get authors
function getAuthors(data) {
    const authors = {};
    data.forEach((item) => {
        if (item.type === 'author') {
            authors[item.id] = item.attributes.name;
        }
    })
    return authors;
}
// get departments
function getDepartments(data) {
    const departments = {};
    data.forEach((item) => {
        if (item.type === 'department') {
            departments[item.id] = item.attributes.name;
        }
    })
    return departments;
}


// Register Route
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please log in." });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Hash password
        const hashPass = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({ username, password: hashPass, verificationToken});
        await newUser.save();

        // send verification email
        const verificationLink = `http://localhost:5001/verify?token=${verificationToken}`;
        await transporter.sendMail({
            from: 'ResearchGator" <gatorresearchtest@gmail.com>',
            to: username,
            subject: 'Please verify your email for ResearchGator',
            text: `Click on the link to verify your email: ${verificationLink}`
        });

        res.json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error during registration:", err.message);
        res.status(500).json({ message: "Error registering user" });
    }
});

// verify route
app.get("/verify", async (req, res) => {
    try {
        const {token} = req.query;
        const user = await User.findOne({verificationToken: token});
        if (!user) {
            return res.status(400).send(`
            <html>
                <body style="
                    text-align: center; 
                    margin-top: 50px; 
                    height: 100vh; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center;
                    background: linear-gradient(90deg, #0021A5, #002657);
                    color: #fff;
                    font-family: Arial, sans-serif;
                ">
                    <h2>Invalid or expired token</h2>
                    <p>Please try again or contact support</p>
                </body>
            </html>
            `)
        }
        user.verified = true;
        user.verificationToken = null
        await user.save();
        res.send(`
        <html>
            <body style="
                text-align: center; 
                margin-top: 50px; 
                height: 100vh; 
                display: flex; 
                justify-content: center; 
                align-items: center;
                background: linear-gradient(90deg, #0021A5, #002657);
                color: #fff;
                font-family: Arial, sans-serif;
            ">
                <h2 style="color: #22884C; margin: 0 0 15px 0">Email verified successfully! </h2>
                <p style="margin: 0">You can now log in. This page will automatically close in 5 seconds.</p>
                <script>
                    setTimeout(() => {
                        window.close();
                    }, 5000);
                </script>
            </body>
        </html>     
        `)
    }
    catch (err) {
        res.status(500).json({message: "Error verifying email"});
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Check if user is verified
        if (!user.verified) {
            return res.status(400).json({ message: "User not verified." });
        }

        // Compare password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // Generate token
        const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ message: "Error logging in" });
    }
});

// search route
app.post("/search", async (req, res) => {
    const { major} = req.body;
    try {
        const q = `${major}`.trim();
        const timeframe = '1y';
        const type = 'article';
        const pages = 10;

        const url = createRequestURL({ q, timeframe, type, pages });
        console.log('Request URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const authorMap = getAuthors(data.included);
        const departmentMap = getDepartments(data.included);

        const results = data.data.map((item, index) => {
            const title = item.attributes.title || 'N/A';
            const authors = item.relationships?.['institutional-authors'] || [];
            const department = item.relationships?.['institutional-departments'] || [];
            const authorNames = authors.map((author) => authorMap[author.id] || 'Unknown').filter(Boolean);
            const departmentNames = department.map((dept) => departmentMap[dept.id] || 'Unknown').filter(Boolean);
            return {title, authors: authorNames, departments: departmentNames};
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

// Start the server
const port = 5001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

