import React from 'react'
import { useLabStore } from '../store/labStore'
import { analyzeCircuit } from '../engine/circuitEngine'

export const DataPanel: React.FC = () => {
  const components = useLabStore((state) => state.components)
  const measurements = useLabStore((state) => state.measurements)
  const isRunning = useLabStore((state) => state.isRunning)

  const analysis = isRunning ? analyzeCircuit(components) : null

  return (
    <div className="w-72 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">数据面板</h2>
      </div>

      {analysis && (
        <div className="p-4 space-y-4">
          <div className="bg-indigo-50 rounded-lg p-3">
            <h3 className="text-sm font-medium text-indigo-700 mb-2">电路分析结果</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">总电压</span>
                <span className="font-mono font-medium">{analysis.totalVoltage.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总电阻</span>
                <span className="font-mono font-medium">{analysis.totalResistance.toFixed(2)} Ω</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总电流</span>
                <span className="font-mono font-medium text-indigo-600">{analysis.current.toFixed(3)} A</span>
              </div>
            </div>
          </div>

          {Object.keys(analysis.componentVoltages).length > 0 && (
            <div className="bg-green-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-green-700 mb-2">元件电压</h3>
              <div className="space-y-1">
                {Object.entries(analysis.componentVoltages).map(([id, voltage]) => (
                  <div key={id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{id}</span>
                    <span className="font-mono">{voltage.toFixed(2)} V</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(analysis.componentCurrents).length > 0 && (
            <div className="bg-amber-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-amber-700 mb-2">元件电流</h3>
              <div className="space-y-1">
                {Object.entries(analysis.componentCurrents).map(([id, current]) => (
                  <div key={id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{id}</span>
                    <span className="font-mono">{current.toFixed(3)} A</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {Object.keys(measurements).length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">手动记录数据</h3>
          <div className="space-y-1">
            {Object.entries(measurements).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-600">{key}</span>
                <span className="font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isRunning && components.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">点击「运行实验」查看数据</p>
        </div>
      )}
    </div>
  )
}
