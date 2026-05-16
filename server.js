const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MariaDB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'adminfastech',
  password: '1234',
  database: 'fastech_db'
});

db.connect(err => {
  if (err) console.error("Error conectando a la DB:", err);
  else console.log("Conectado a MariaDB con éxito");
});

// OBTENER productos
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// AGREGAR producto
app.post('/productos', (req, res) => {
  const { nombre, precio, stock } = req.body;
  db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
  [nombre, precio, stock], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, ...req.body });
  });
});

// ELIMINAR producto (NUEVA FUNCIÓN)
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Eliminado correctamente" });
  });
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));