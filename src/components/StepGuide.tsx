import React from 'react'
import { useLabStore } from '../store/labStore'
import { experiments } from '../data/experiments'

export const StepGuide: React.FC = () => {
  const stepIndex = useLabStore((state) => state.stepIndex)
  const setStepIndex = useLabStore((state) => state.setStepIndex)
  const currentExperiment = useLabStore((state) => state.currentExperiment)

  const experiment = experiments.find((e) => e.id === currentExperiment)
  if (!experiment || experiment.steps.length === 0) return null

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 max-w-lg w-full z-10">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">实验步骤引导</h3>
        <span className="text-xs text-gray-400">
          {stepIndex + 1} / {experiment.steps.length}
        </span>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-800 font-medium">{experiment.steps[stepIndex]}</p>
        
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
                idx <= stepIndex ? 'bg-indigo-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
