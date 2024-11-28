import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    });

    if (!todos) {
        return res.status(404).json({ error: "No ToDos assigned to you" });
    }
    res.status(200).json(todos);
});

// create a todo
router.post('/', async (req, res) => {
    const { task } = req.body;
    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    });

    res.status(201).json(todo);
});

// update a todo
router.put('/:id', async (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;

    const updatedTodo = await prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed //converts int to boolean
        }
    }) // Update syntax of Prisma

    res.status(200).json(updatedTodo);
});

// delete a todo
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId,
        }
    });
    res.status(200).json({ message: "ToDo deleted Successfully" });
});

export default router;