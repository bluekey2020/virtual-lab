import React, { useState, useCallback } from 'react'
import { EquipmentPanel } from './EquipmentPanel'
import { ExperimentCanvas } from './ExperimentCanvas'
import { DataPanel } from './DataPanel'
import { StepGuide } from './StepGuide'
import { AIPanel } from './AIPanel'
import { PropertyEditor } from './PropertyEditor'
import { DataRecorder } from './DataRecorder'
import { ReportGenerator } from './ReportGenerator'
import { useLabStore } from '../store/labStore'
import { getComponent } from '../plugins/ComponentPlugin'
import type { CircuitComponent } from '../types'

let componentIdCounter = 0

export const ExperimentWorkbench: React.FC = () => {
  const [showAI, setShowAI] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const addComponent = useLabStore((state) => state.addComponent)
  const currentExperiment = useLabStore((state) => state.currentExperiment)
  const isRunning = useLabStore((state) => state.isRunning)
  const toggleRunning = useLabStore((state) => state.toggleRunning)
  const resetExperiment = useLabStore((state) => state.resetExperiment)

  const handleDragStart = useCallback((equipmentId: string) => {
    window._dragEquipmentId = equipmentId
  }, [])

  const handleDrop = useCallback(
    (_e: React.DragEvent, x: number, y: number) => {
      const equipmentId = window._dragEquipmentId
      if (!equipmentId) return

      const plugin = getComponent(equipmentId)
      if (!plugin) return

      const newComponent: CircuitComponent = {
        id: `comp_${++componentIdCounter}`,
        type: equipmentId,
        x: x - plugin.width / 2,
        y: y - plugin.height / 2,
        rotation: 0,
        properties: { ...plugin.defaultProperties },
        connections: [],
      }

      addComponent(newComponent)
      window._dragEquipmentId = null
    },
    [addComponent]
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <EquipmentPanel onDragStart={handleDragStart} />
      
      <div className="flex-1 flex flex-col relative">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">
              {currentExperiment ? '虚拟实验台' : '选择实验开始'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAI(!showAI)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                showAI
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🤖 AI 助手
            </button>
            
            <ReportGenerator />
            
            <button
              onClick={toggleRunning}
              disabled={!currentExperiment}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isRunning
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isRunning ? '停止实验' : '运行实验'}
            </button>
            
            <button
              onClick={resetExperiment}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              重置
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <ExperimentCanvas onDrop={handleDrop} />
          <StepGuide />
          <PropertyEditor />
          <DataRecorder />
          {showAI && <AIPanel onClose={() => setShowAI(false)} />}
          {showReport && <ReportGenerator />}
        </div>
      </div>

      <DataPanel />
    </div>
  )
}

declare global {
  interface Window {
    _dragEquipmentId: string | null
  }
}

window._dragEquipmentId = null
