// App.tsx
import React from 'react'
import AppRouter from './config/AppRouter'
import { BrowserRouter } from 'react-router-dom'
import GlobalModal from './shared/components/GlobalModal'

const App: React.FC = () => (
  <BrowserRouter>
    <AppRouter />
    <GlobalModal />
  </BrowserRouter>
)

export default App
