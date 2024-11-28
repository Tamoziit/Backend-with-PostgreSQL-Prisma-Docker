import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(':memory:'); //initializing SQLite DB

// Executing SQL statements from strings (Similar to Models in Non-SQL DBs)
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username TEXT UNIQUE,
        password TEXT
    )    
`); // NB: PRIMARY KEY: Unique identification key that can be used to reference other collections or tables (ie, here, any entry of the "todos" Table can be exclusively referenced or assigned to a particular user from "users" Table.)

db.exec(`
    CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEST,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )    
`); // any user can be referenced to using the user_id field linked to "users" Table.

export default db;