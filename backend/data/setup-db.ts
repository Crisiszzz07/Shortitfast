import { pool } from "./database";

const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Container (
            id SERIAL PRIMARY KEY,
            longUrl TEXT NOT NULL,
            shortUrl TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.connect();
        await pool.query(query);
        console.log("Table 'Container' created or already exists.");
    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        await pool.end();
    }
};

createTable();
