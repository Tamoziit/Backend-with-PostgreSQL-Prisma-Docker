const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

let data = ['Tamoziit']

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <body style="background:cyan; color:brown">
            <h1>Data</h1>
            <p>${JSON.stringify(data)}</p>
        </body> 
    `);
    console.log('YAAYYYY', req.method);
});

app.get('/dashboard', (req, res) => {
    res.send("hi");
    console.log("/dashboard", req.headers);
});

app.get("/api/data", (req, res) => {
    console.log("API endpoint", req.pipe);
    res.send(data);
});

app.post("/api/data", (req, res) => {
    const newEntry = req.body;
    console.log(newEntry);
    data.push(newEntry.name);
    res.sendStatus(201);
});

app.delete('/api/delete', (req, res) => {
    const rem = data.pop();
    console.log(`Deleted data: ${rem}`);
    res.sendStatus(203);
})

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
})