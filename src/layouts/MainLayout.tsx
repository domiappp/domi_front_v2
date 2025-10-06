import React from 'react'
import { Outlet } from 'react-router-dom'
import NavbarAdmin from '../shared/components/NavbarAdmin'
import Sidebar from '../shared/components/Sidebar'


const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0F3F5] flex">


      <Sidebar />
      <div className='w-full'>
        <NavbarAdmin />
        <main className="max-w-full mx-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout