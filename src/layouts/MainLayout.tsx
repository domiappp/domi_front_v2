// MainLayout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import NavbarAdmin from '../shared/components/NavbarAdmin'
import Sidebar from '../shared/components/Sidebar'
import { Menu, X } from 'lucide-react'
import { useSidebarStore } from '../store/sidebar.store'

const MainLayout: React.FC = () => {
  const toggle = useSidebarStore((s) => s.toggle)
  const isOpen = useSidebarStore((s) => s.isOpen)
  const position = useSidebarStore((s) => s.position)

  // Clases del botón según posición + estado
  const sideClosedClass = position === 'left' ? 'left-3' : 'right-3'
  const sideOpenClass = position === 'left' ? 'left-[310px]' : 'right-[310px]'
  const sideClass = isOpen ? sideOpenClass : sideClosedClass

  return (
    <div className="min-h-screen bg-[#F0F3F5] flex">
      {/* Si el sidebar va a la izquierda, lo renderizamos primero; si va a la derecha, al final */}
      {position === 'left' && <Sidebar />}

      <div className="w-full relative">
        <NavbarAdmin />
        <main className="max-w-full mx-auto p-4">
          <Outlet />
        </main>

        {/* Botón flotante adaptable */}
        <button
          className={[
            'lg:hidden fixed z-50 top-8 -translate-y-1/2',
            'p-3 rounded-full shadow bg-red-500 text-white hover:bg-red-600 transition',
            sideClass,
          ].join(' ')}
          onClick={toggle}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {position === 'right' && <Sidebar />}
    </div>
  )
}

export default MainLayout
