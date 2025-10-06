// src/main.tsx
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import App from './App'
import './index.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'

// 1) Crea el QueryClient con defaults razonables
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min “fresh”
      gcTime: 30 * 60 * 1000,         // 30 min en memoria
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
})

// 2) Marca SOLO el prefijo de keys que quieres persistir
//    (coincide con tu archivo useComerciosPorServicio.ts → comerciosPorServicioKeys.all)
queryClient.setQueryDefaults(['comerciosPorServicio'], {
  meta: { persist: true },
})

// 3) Configura la persistencia filtrando por meta.persist === true
const persister = createSyncStoragePersister({
  storage: window.sessionStorage, // usa localStorage si quieres que dure más
})

persistQueryClient({
  queryClient,
  persister,
  maxAge: 30 * 60 * 1000, // 30 min
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      // No persistir errores (opcional)
      if (query.state.status === 'error') return false
      // Persistir solo las queries marcadas
      return query.meta?.persist === true
    },
  },
})

function Root() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />)
