import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerAllComponents } from './plugins/components/index.ts'
import { useLabStore } from './store/labStore.ts'

// 注册所有插件组件
registerAllComponents()

function AppWithStorage() {
  const loadFromStorage = useLabStore((state) => state.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithStorage />
  </StrictMode>,
)
