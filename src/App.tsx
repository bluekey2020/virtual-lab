import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ExperimentList } from './components/ExperimentList'
import { ExperimentWorkbench } from './components/ExperimentWorkbench'
import { useLabStore } from './store/labStore'

const queryClient = new QueryClient()

function App() {
  const [view, setView] = useState<'list' | 'workbench'>('list')
  const setCurrentExperiment = useLabStore((state) => state.setCurrentExperiment)

  const handleSelectExperiment = (id: string) => {
    setCurrentExperiment(id)
    setView('workbench')
  }

  const handleBack = () => {
    setView('list')
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen">
        {view === 'list' ? (
          <ExperimentList onSelect={handleSelectExperiment} />
        ) : (
          <div className="relative">
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 z-30 px-3 py-1.5 text-sm font-medium rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-800 transition-colors shadow-sm"
            >
              ← 返回实验列表
            </button>
            <ExperimentWorkbench />
          </div>
        )}
      </div>
    </QueryClientProvider>
  )
}

export default App
