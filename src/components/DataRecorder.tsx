import React, { useState } from 'react'
import { useLabStore } from '../store/labStore'
import { analyzeCircuit } from '../engine/circuitEngine'

export const DataRecorder: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState('')
  const components = useLabStore((state) => state.components)
  const isRunning = useLabStore((state) => state.isRunning)
  const dataRecords = useLabStore((state) => state.dataRecords)
  const addDataRecord = useLabStore((state) => state.addDataRecord)
  const removeDataRecord = useLabStore((state) => state.removeDataRecord)
  const clearDataRecords = useLabStore((state) => state.clearDataRecords)

  const analysis = isRunning ? analyzeCircuit(components) : null

  const handleRecord = () => {
    if (!analysis) return

    addDataRecord({
      id: `record_${Date.now()}`,
      timestamp: Date.now(),
      values: {
        voltage: analysis.totalVoltage,
        current: analysis.current,
        resistance: analysis.totalResistance,
      },
      note: note || undefined,
    })
    setNote('')
  }

  const handleDelete = (id: string) => {
    removeDataRecord(id)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 left-4 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
      >
        📝 数据记录 ({dataRecords.length})
      </button>
    )
  }

  return (
    <div className="absolute bottom-4 left-4 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-10 max-h-[400px] flex flex-col">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">📝 数据记录</h3>
        <div className="flex gap-2">
          {dataRecords.length > 0 && (
            <button
              onClick={clearDataRecords}
              className="text-xs text-red-500 hover:text-red-600"
            >
              清空
            </button>
          )}
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {dataRecords.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">暂无记录</p>
        ) : (
          <div className="space-y-2">
            {dataRecords.map((record) => (
              <div key={record.id} className="bg-gray-50 rounded-lg p-2 text-xs">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="flex gap-3">
                      <span className="text-gray-600">U: <span className="font-mono">{record.values.voltage?.toFixed(2)}V</span></span>
                      <span className="text-gray-600">I: <span className="font-mono">{record.values.current?.toFixed(3)}A</span></span>
                      <span className="text-gray-600">R: <span className="font-mono">{record.values.resistance?.toFixed(2)}Ω</span></span>
                    </div>
                    {record.note && (
                      <p className="text-gray-500 mt-1">备注: {record.note}</p>
                    )}
                    <p className="text-gray-400">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {analysis && (
        <div className="p-3 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注..."
              className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleRecord}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              记录
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
