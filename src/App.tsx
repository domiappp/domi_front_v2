// App.tsx
import React from 'react'
import AppRouter from './config/AppRouter'
import { BrowserRouter } from 'react-router-dom'
import GlobalModal from './shared/components/GlobalModal'
import CartSidebar from './shared/components/CartSidebar'

const App: React.FC = () => (
  <BrowserRouter>
    <AppRouter />
    <GlobalModal />
     <CartSidebar />
  </BrowserRouter>
)

export default App
