// src/pages/ComercioPage.tsx
import React, { useState } from 'react'
import CategoriaProductos from '../../shared/components/CategoriaProductos'
import ProductosGrid from '../../shared/components/ProductosGrid'

const mockCategorias = [
  'Todas', 'Pizza', 'Hamburguesas', 'Arepas', 'Patacones',
  'Sandwich', 'Perros calientes', 'Salchipapas', 'Bebidas'
]

const mockProductos = [
  {
    id: '1',
    nombre: 'Jarra de jugo en leche',
    descripcion: 'Jarra de jugo de leche',
    precio: 15000,
    imagen: '/img/jugo-leche.png'
  },
  {
    id: '2',
    nombre: 'Hamburguesa con todo',
    descripcion: 'Pan, carne, queso y vegetales frescos',
    precio: 20000,
    imagen: '/img/hamburguesa.png'
  },
  {
    id: '3',
    nombre: 'Milo caliente',
    descripcion: 'Bebida caliente de chocolate',
    precio: 7000,
    imagen: '/img/milo.png'
  }
]

const ComercioPage: React.FC = () => {
  const [categoria, setCategoria] = useState('Todas')
  const [query, setQuery] = useState('')

  const productosFiltrados = mockProductos.filter(p =>
    (categoria === 'Todas' || p.nombre.includes(categoria)) &&
    p.nombre.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-full mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold">PIZZERIA VIANDA</h1>
      <p className="text-gray-600 mb-6">Pizzería y comidas rápidas</p>

      <CategoriaProductos
        categorias={mockCategorias}
        categoriaActiva={categoria}
        onChange={setCategoria}
      />

      <ProductosGrid
        productos={productosFiltrados}
        query={query}
        onSearch={setQuery}
        onAdd={(id: any) => console.log('Agregar producto', id)}
      />
    </div>
  )
}

export default ComercioPage
