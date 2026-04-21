import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { experiments } from '../data/experiments'
import { useResponsive } from '../hooks/useResponsive'
import type { CircuitComponent } from '../types'

type MobilePanel = 'equipment' | 'canvas' | 'data' | null

let componentIdCounter = 0

export const ExperimentWorkbench: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isMobile } = useResponsive()
  const [showAI, setShowAI] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(isMobile ? 'canvas' : null)
  const addComponent = useLabStore((state) => state.addComponent)
  const currentExperiment = useLabStore((state) => state.currentExperiment)
  const isRunning = useLabStore((state) => state.isRunning)
  const toggleRunning = useLabStore((state) => state.toggleRunning)
  const resetExperiment = useLabStore((state) => state.resetExperiment)
  const setCurrentExperiment = useLabStore((state) => state.setCurrentExperiment)

  // 初始化实验
  useEffect(() => {
    if (id && id !== currentExperiment) {
      setCurrentExperiment(id)
    }
  }, [id, currentExperiment, setCurrentExperiment])

  // 移动端切换面板时重置
  useEffect(() => {
    if (isMobile && !mobilePanel) {
      setMobilePanel('canvas')
    }
  }, [isMobile, mobilePanel])

  const experiment = experiments.find((e) => e.id === currentExperiment)

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

  const handleBack = () => {
    navigate('/')
  }

  // 桌面端布局
  if (!isMobile) {
    return (
      <div className="flex h-screen bg-gray-50">
        <EquipmentPanel onDragStart={handleDragStart} />
        
        <div className="flex-1 flex flex-col relative">
          <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                ← 返回
              </button>
              <h1 className="text-lg font-semibold text-gray-800">
                {experiment ? experiment.title : '虚拟实验台'}
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
          </div>
        </div>

        <DataPanel />
      </div>
    )
  }

  // 移动端布局
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-3 shrink-0">
        <button
          onClick={handleBack}
          className="px-2 py-1 text-sm font-medium rounded-lg bg-gray-100 text-gray-600"
        >
          ←
        </button>
        <h1 className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">
          {experiment ? experiment.title : '虚拟实验台'}
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleRunning}
            disabled={!currentExperiment}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors disabled:opacity-40 ${
              isRunning ? 'bg-amber-500 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {isRunning ? '停止' : '运行'}
          </button>
          <button
            onClick={resetExperiment}
            className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600"
          >
            重置
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 relative overflow-hidden">
        {mobilePanel === 'equipment' && (
          <div className="absolute inset-0 z-10 bg-white">
            <EquipmentPanel onDragStart={handleDragStart} />
          </div>
        )}
        
        {mobilePanel === 'canvas' && (
          <div className="absolute inset-0">
            <ExperimentCanvas onDrop={handleDrop} />
            <StepGuide />
            <PropertyEditor />
            <DataRecorder />
            {showAI && <AIPanel onClose={() => setShowAI(false)} />}
          </div>
        )}
        
        {mobilePanel === 'data' && (
          <div className="absolute inset-0 z-10 bg-white overflow-y-auto">
            <DataPanel />
          </div>
        )}
      </div>

      {/* 底部导航栏 */}
      <div className="h-14 bg-white border-t border-gray-200 flex items-center justify-around shrink-0">
        <button
          onClick={() => setMobilePanel('equipment')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            mobilePanel === 'equipment' ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <span className="text-lg">🔧</span>
          <span className="text-[10px]">器材</span>
        </button>
        
        <button
          onClick={() => setMobilePanel('canvas')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            mobilePanel === 'canvas' ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <span className="text-lg">🔬</span>
          <span className="text-[10px]">实验台</span>
        </button>
        
        <button
          onClick={() => setShowAI(!showAI)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            showAI ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <span className="text-lg">🤖</span>
          <span className="text-[10px]">AI</span>
        </button>
        
        <button
          onClick={() => setMobilePanel('data')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            mobilePanel === 'data' ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px]">数据</span>
        </button>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    _dragEquipmentId: string | null
  }
}

window._dragEquipmentId = null
