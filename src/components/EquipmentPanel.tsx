import React from 'react'
import { equipmentCatalog } from '../data/experiments'

interface EquipmentPanelProps {
  onDragStart: (equipmentId: string) => void
}

const categories = ['电源类', '元件类', '控制类', '测量类', '连接类']

export const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ onDragStart }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">器材库</h2>
        <p className="text-sm text-gray-500 mt-1">拖拽器材到实验台</p>
      </div>
      
      {categories.map((category) => {
        const items = equipmentCatalog.filter((e) => e.category === category)
        if (items.length === 0) return null
        
        return (
          <div key={category} className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{category}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => onDragStart(item.id)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-50 cursor-grab active:cursor-grabbing transition-colors border border-gray-100 hover:border-indigo-200"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {Object.entries(item.properties)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(', ') || '无参数'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
