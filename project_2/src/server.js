import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // serving html file from /public & also tells express to serve all files from public as static files

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on Port: ${PORT}`);
});