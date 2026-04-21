import React from 'react'
import { useLabStore } from '../store/labStore'
import { experiments } from '../data/experiments'

export const StepGuide: React.FC = () => {
  const stepIndex = useLabStore((state) => state.stepIndex)
  const setStepIndex = useLabStore((state) => state.setStepIndex)
  const currentExperiment = useLabStore((state) => state.currentExperiment)
  const components = useLabStore((state) => state.components)
  const wires = useLabStore((state) => state.wires)
  const dataRecords = useLabStore((state) => state.dataRecords)

  const experiment = experiments.find((e) => e.id === currentExperiment)
  if (!experiment || experiment.steps.length === 0) return null

  // 步骤完成检测
  const isStepComplete = (idx: number): boolean => {
    const step = experiment.steps[idx].toLowerCase()
    
    // 检测是否包含"连接"、"拖拽"等关键词
    if (step.includes('连接') || step.includes('拖拽')) {
      return components.length > 0
    }
    // 检测是否需要导线
    if (step.includes('串联') || step.includes('并联') || step.includes('导线')) {
      return wires.length > 0
    }
    // 检测是否需要记录数据
    if (step.includes('记录') || step.includes('测量')) {
      return dataRecords.length > 0
    }
    // 检测是否需要闭合开关
    if (step.includes('闭合')) {
      return components.some((c) => c.type === 'switch' && c.properties.closed === 1)
    }
    // 检测是否需要改变电压
    if (step.includes('改变') && step.includes('电压')) {
      const batteries = components.filter((c) => c.type === 'battery')
      return batteries.some((b) => b.properties.voltage !== 3)
    }
    // 检测是否需要分析数据
    if (step.includes('分析') || step.includes('验证') || step.includes('完成')) {
      return dataRecords.length >= 2
    }
    
    return false
  }

  const completedCount = experiment.steps.filter((_, idx) => isStepComplete(idx)).length
  const progress = (completedCount / experiment.steps.length) * 100

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 max-w-lg w-full z-10">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700">实验步骤引导</h3>
          <span className="text-xs text-gray-400">({completedCount}/{experiment.steps.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-green-600 font-medium">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
            isStepComplete(stepIndex)
              ? 'bg-green-500 text-white'
              : 'bg-indigo-100 text-indigo-600'
          }`}>
            {isStepComplete(stepIndex) ? (
              <span className="text-xs">✓</span>
            ) : (
              <span className="text-xs font-bold">{stepIndex + 1}</span>
            )}
          </div>
          <p className="text-sm text-gray-800 font-medium">{experiment.steps[stepIndex]}</p>
        </div>
        
        {isStepComplete(stepIndex) && (
          <p className="text-xs text-green-600 mt-2 ml-9 flex items-center gap-1">
            <span>✓</span> 此步骤已完成
          </p>
        )}
        
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
            disabled={stepIndex === 0}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            上一步
          </button>
          <button
            onClick={() => setStepIndex(Math.min(experiment.steps.length - 1, stepIndex + 1))}
            disabled={stepIndex === experiment.steps.length - 1}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            下一步
          </button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex gap-1">
          {experiment.steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStepIndex(idx)}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                idx < stepIndex
                  ? 'bg-green-500'
                  : idx === stepIndex
                  ? 'bg-indigo-500'
                  : isStepComplete(idx)
                  ? 'bg-green-300'
                  : 'bg-gray-200'
              }`}
              title={`步骤 ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
