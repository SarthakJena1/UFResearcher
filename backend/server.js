import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const users = []

// register
app.post("/register", async (req, res) =>  {
    const { username, password } = req.body;

    const hashPass = await bcrypt.hash(password, 10);

    // save users
    users.push({
        username,
        password: hashPass
    });
    res.json({ message: "User registered" });
})

// login
app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(400).json({message: "User not found"});
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(400).json({message: "Invalid password"});
    }

    // generate token
    const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
    res.json({ message: "Login successful" });
});

// default route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
