import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) values(?, ?)`); // initialize a new entry into the "users" table using SQLite prepare() func.
        const result = insertUser.run(username, hashedPassword); // populating the new entry with the values;

        // Assigning a default ToDo to the user on registration
        const defaultTodo = `Hello :) Add your first ToDo`;
        const insertToDo = db.prepare(`INSERT INTO todos (user_id, task) values(?, ?)`);
        insertToDo.run(result.lastInsertRowid, defaultTodo); // lastInsertRowid --> provides the id or primary key of the last inserted entry of the Table

        // creating a token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token });
    } catch (err) {
        console.log("Error in Register controller", err);
        res.status(503).json({ error: "Internal Server Error" });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?'); // get all users & then filter out the specific username
        const user = getUser.get(username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: "Invalid Login Credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log(user);
        res.status(200).json({ token });
    } catch (err) {
        console.log("Error in Login controller", err);
        res.status(503).json({ error: "Internal Server Error" });
    }
});

export default router;