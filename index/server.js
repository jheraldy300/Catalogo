const express = require('express');  
const { Client } = require('pg');
require('dotenv').config({ path: './index/.env' });  
console.log('Variables cargadas' , process.env); 
const app = express(); 
const cors = require('cors');
app.use(cors());


console.log({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

client.connect()
    .then(() => console.log("Conectado a la base de datos"))
    .catch(err => console.error("Error de conexión: ", err));

app.get('/products', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.ProductID, 
                p.ProductName, 
                p.Description, 
                p.Stock, 
                c.CategoryName
            FROM Products p
            JOIN Categories c ON p.CategoryID = c.CategoryID;
        `;
        const result = await client.query(query);
        res.json(result.rows); 
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

console.log(process.env.DB_PASSWORD); 
