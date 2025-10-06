import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../shared/components/Navbar'
import MenuMovil from '../shared/components/MenuMovil'

const PublicLayout: React.FC = () => {
    return (
        <>
            <Navbar />
      
            <Outlet />
            <MenuMovil />
        </>
    )
}

export default PublicLayout