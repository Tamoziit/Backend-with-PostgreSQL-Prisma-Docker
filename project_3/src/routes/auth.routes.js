import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        }); // Prisma syntax for creating an entry in a collection in Postgre DB

        // Assigning a default ToDo to the user on registration
        const defaultTodo = `Hello :) Add your first ToDo`;
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        // creating a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token });
    } catch (err) {
        console.log("Error in Register controller", err);
        res.status(503).json({ error: "Internal Server Error" });
    }
});

router.post('/login', async(req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

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