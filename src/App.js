import React, { useState, useEffect } from 'react';
import './App.css'; // Esto es VITAL para que los colores funcionen

export default function App() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [busqueda, setBusqueda] = useState(''); // Nueva función: Buscador

  // 1. LEER datos de la DB real
  useEffect(() => {
    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  // 2. GUARDAR en la DB real
  const agregarProducto = async (e) => {
    e.preventDefault();
    const nuevo = { nombre, precio: parseFloat(precio), stock: parseInt(stock) };
    
    try {
      const res = await fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      });
      
      const productoGuardado = await res.json();
      setProductos([...productos, productoGuardado]);
      setNombre(''); setPrecio(''); setStock('');
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

 // 3. ELIMINAR de la DB real
const eliminarProducto = async (id) => {
  // --- AÑADE ESTA LÍNEA AQUÍ ---
  console.log("ID que vamos a eliminar:", id); 
  // -----------------------------

  if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    try {
      const res = await fetch(`http://localhost:3000/productos/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProductos(productos.filter(p => p.id !== id));
      }
    } catch (error) {
      alert("No se pudo eliminar el producto");
    }
  }
};

  // 4. LÓGICA DEL BUSCADOR
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🚀 PANEL DE INVENTARIO</h1>

      {/* Formulario para Agregar */}
      <form className="form-card" onSubmit={agregarProducto}>
        <div className="input-group">
          <label>Nombre del Producto</label>
          <input 
            placeholder="Ej. Laptop Gamer" 
            value={nombre} 
            onChange={e => setNombre(e.target.value)} 
            required
          />
        </div>
        
        <div className="input-group">
          <label>Precio</label>
          <input 
            placeholder="0.00" 
            type="number" 
            step="0.01"
            value={precio} 
            onChange={e => setPrecio(e.target.value)} 
            required
          />
        </div>

        <div className="input-group">
          <label>Existencias</label>
          <input 
            placeholder="Cantidad" 
            type="number" 
            value={stock} 
            onChange={e => setStock(e.target.value)} 
            required
          />
        </div>

        <button type="submit" className="btn-save">Guardar en MySQL</button>
      </form>

      {/* Buscador en Tiempo Real */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="🔍 Buscar producto por nombre..." 
          className="search-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Cuadrícula de Tarjetas */}
      <div className="grid-productos">
        {productosFiltrados.map(p => (
          <div key={p.id} className="producto-card">
            <span className="stock-tag">📦 {p.stock} en stock</span>
            <h3>{p.nombre}</h3>
            <p className="price-tag">${parseFloat(p.precio).toFixed(2)}</p>
            
            <button 
              className="btn-delete" 
              onClick={() => eliminarProducto(p.id)}
            > 
              Eliminar Producto
            </button>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados en la búsqueda */}
      {productosFiltrados.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8' }}>
          No se encontraron productos que coincidan.
        </p>
      )}
    </div>
  );
}