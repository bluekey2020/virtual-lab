import React from 'react'
import { useLabStore } from '../store/labStore'
import { getComponent } from '../plugins/ComponentPlugin'

export const PropertyEditor: React.FC = () => {
  const selectedComponent = useLabStore((state) => state.selectedComponent)
  const components = useLabStore((state) => state.components)
  const updateComponent = useLabStore((state) => state.updateComponent)

  if (!selectedComponent) return null

  const component = components.find((c) => c.id === selectedComponent)
  if (!component) return null

  const plugin = getComponent(component.type)
  if (!plugin || plugin.propertyConfig.length === 0) return null

  return (
    <div className="absolute top-4 right-4 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
      <div className="p-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">
          {plugin.icon} {plugin.name} - 属性编辑
        </h3>
      </div>
      
      <div className="p-3 space-y-3">
        {plugin.propertyConfig.map((config) => {
          const value = component.properties[config.key] ?? config.min
          
          return (
            <div key={config.key}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{config.label}</span>
                <span className="font-mono">{value}{config.unit}</span>
              </div>
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                value={value}
                onChange={(e) => {
                  updateComponent(component.id, {
                    properties: { ...component.properties, [config.key]: parseFloat(e.target.value) }
                  })
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                <span>{config.min}{config.unit}</span>
                <span>{config.max}{config.unit}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
