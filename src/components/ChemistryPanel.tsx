import React, { useState, useEffect } from 'react'
import { useLabStore } from '../store/labStore'
import { analyzeChemistry, type ChemistryAnalysisResult } from '../engine/chemistryEngine'

export const ChemistryPanel: React.FC = () => {
  const components = useLabStore((state) => state.components)
  const isRunning = useLabStore((state) => state.isRunning)
  const [analysis, setAnalysis] = useState<ChemistryAnalysisResult | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (isRunning) {
      const result = analyzeChemistry(components)
      setAnalysis(result)

      const timer = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    } else {
      setElapsed(0)
    }
  }, [isRunning, components])

  if (!isRunning || !analysis) {
    return null
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-4 space-y-4">
      {/* 实验状态 */}
      <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
        <h3 className="text-sm font-medium text-cyan-700 mb-2">化学实验状态</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">温度</span>
            <span className="font-mono font-medium">{analysis.temperature.toFixed(1)} °C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">pH 值</span>
            <span className={`font-mono font-medium ${
              analysis.ph < 7 ? 'text-red-600' : analysis.ph > 7 ? 'text-blue-600' : 'text-green-600'
            }`}>{analysis.ph.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">溶液颜色</span>
            <span className="font-medium">{analysis.solutionColor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">反应时间</span>
            <span className="font-mono">{formatTime(elapsed)}</span>
          </div>
        </div>
      </div>

      {/* 正在进行的反应 */}
      {analysis.reactions.length > 0 && (
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <h3 className="text-sm font-medium text-amber-700 mb-2">化学反应</h3>
          <div className="space-y-2">
            {analysis.reactions.map((rxn) => (
              <div key={rxn.reactionId} className="bg-white rounded p-2 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${rxn.isHappening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                  <span className="font-medium text-gray-800">{rxn.reactionName}</span>
                </div>
                <p className="font-mono text-gray-600 ml-4">{rxn.equation}</p>
                {rxn.isHappening && (
                  <div className="mt-1 ml-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(rxn.rate * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-500">反应速率: {(rxn.rate * 100).toFixed(0)}%</span>
                  </div>
                )}
                {rxn.phenomena.length > 0 && (
                  <div className="mt-1 ml-4 space-y-0.5">
                    {rxn.phenomena.map((p, i) => (
                      <p key={i} className="text-gray-500">• {p}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 气体产物 */}
      {Object.keys(analysis.gasProduced).length > 0 && (
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <h3 className="text-sm font-medium text-green-700 mb-2">气体产物</h3>
          <div className="space-y-1">
            {Object.entries(analysis.gasProduced).map(([gas, volume]) => (
              <div key={gas} className="flex justify-between text-xs">
                <span className="text-gray-600">{gas}</span>
                <span className="font-mono">{volume.toFixed(1)} mL</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 沉淀物 */}
      {Object.keys(analysis.precipitate).length > 0 && (
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <h3 className="text-sm font-medium text-purple-700 mb-2">沉淀物</h3>
          <div className="space-y-1">
            {Object.entries(analysis.precipitate).map(([name, mass]) => (
              <div key={name} className="flex justify-between text-xs">
                <span className="text-gray-600">{name}</span>
                <span className="font-mono">{mass.toFixed(2)} g</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 观察记录 */}
      {analysis.observations.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">观察记录</h3>
          <div className="space-y-1">
            {analysis.observations.map((obs, i) => (
              <p key={i} className="text-xs text-gray-600 flex items-start gap-1">
                <span className="text-amber-500 mt-0.5">•</span>
                {obs}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
