import React, { useRef, useCallback } from 'react'
import { Stage, Layer, Rect, Text, Circle, Line, Group } from 'react-konva'
import { useLabStore } from '../store/labStore'
import { CircuitComponent } from '../types'
import { equipmentCatalog } from '../data/experiments'

const componentColors: Record<string, string> = {
  battery: '#3b82f6',
  resistor: '#f59e0b',
  switch: '#6b7280',
  ammeter: '#10b981',
  voltmeter: '#8b5cf6',
  bulb: '#fbbf24',
  wire: '#9ca3af',
}

const componentLabels: Record<string, string> = {
  battery: '电源',
  resistor: '电阻',
  switch: '开关',
  ammeter: '电流表',
  voltmeter: '电压表',
  bulb: '灯泡',
  wire: '导线',
}

interface CircuitNodeProps {
  component: CircuitComponent
  isSelected: boolean
  onDragEnd: (e: any) => void
  onClick: () => void
}

const CircuitNode: React.FC<CircuitNodeProps> = ({ component, isSelected, onDragEnd, onClick }) => {
  const color = componentColors[component.type] || '#6b7280'
  const label = componentLabels[component.type] || component.type

  return (
    <Group
      x={component.x}
      y={component.y}
      rotation={component.rotation}
      draggable
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      {component.type === 'battery' && (
        <>
          <Rect width={80} height={50} fill={color} cornerRadius={6} opacity={0.9} />
          <Text text="+" x={10} y={15} fontSize={18} fill="white" fontStyle="bold" />
          <Text text="-" x={60} y={15} fontSize={18} fill="white" fontStyle="bold" />
          <Text text={`${component.properties.voltage}V`} x={25} y={30} fontSize={10} fill="white" />
        </>
      )}

      {component.type === 'resistor' && (
        <>
          <Rect width={80} height={30} fill={color} cornerRadius={4} opacity={0.9} />
          <Text text={`${component.properties.resistance}Ω`} x={20} y={8} fontSize={11} fill="white" />
        </>
      )}

      {component.type === 'switch' && (
        <>
          <Rect width={60} height={40} fill={component.properties.closed ? '#10b981' : '#ef4444'} cornerRadius={6} opacity={0.9} />
          <Text text={component.properties.closed ? '闭合' : '断开'} x={15} y={12} fontSize={12} fill="white" />
        </>
      )}

      {component.type === 'ammeter' && (
        <>
          <Circle x={35} y={35} radius={35} fill={color} opacity={0.9} />
          <Text text="A" x={28} y={25} fontSize={20} fill="white" fontStyle="bold" />
        </>
      )}

      {component.type === 'voltmeter' && (
        <>
          <Circle x={35} y={35} radius={35} fill={color} opacity={0.9} />
          <Text text="V" x={28} y={25} fontSize={20} fill="white" fontStyle="bold" />
        </>
      )}

      {component.type === 'bulb' && (
        <>
          <Circle x={25} y={25} radius={25} fill={color} opacity={0.6 + (component.properties.brightness || 0) * 0.4} />
          <Text text="💡" x={12} y={12} fontSize={24} />
        </>
      )}

      {component.type === 'wire' && (
        <Rect width={100} height={10} fill={color} cornerRadius={2} opacity={0.7} />
      )}

      <Text
        text={label}
        x={component.type === 'ammeter' || component.type === 'voltmeter' ? 15 : 10}
        y={component.type === 'wire' ? -15 : component.type === 'ammeter' || component.type === 'voltmeter' ? 75 : -15}
        fontSize={10}
        fill="#374151"
      />

      {isSelected && (
        <Rect
          width={component.type === 'ammeter' || component.type === 'voltmeter' ? 70 : component.type === 'wire' ? 100 : 80}
          height={component.type === 'ammeter' || component.type === 'voltmeter' ? 70 : component.type === 'wire' ? 10 : component.type === 'resistor' || component.type === 'wire' ? 30 : 50}
          stroke="#4f46e5"
          strokeWidth={2}
          dash={[4, 4]}
          cornerRadius={4}
        />
      )}
    </Group>
  )
}

interface ExperimentCanvasProps {
  onDrop: (e: React.DragEvent, x: number, y: number) => void
}

export const ExperimentCanvas: React.FC<ExperimentCanvasProps> = ({ onDrop }) => {
  const stageRef = useRef<any>(null)
  const components = useLabStore((state) => state.components)
  const selectedComponent = useLabStore((state) => state.selectedComponent)
  const updateComponent = useLabStore((state) => state.updateComponent)
  const selectComponent = useLabStore((state) => state.selectComponent)

  const handleDragEnd = useCallback(
    (id: string) => (e: any) => {
      updateComponent(id, {
        x: e.target.x(),
        y: e.target.y(),
      })
    },
    [updateComponent]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      const stage = stageRef.current
      if (!stage) return

      const pointer = stage.getPointerPosition()
      if (!pointer) return

      onDrop(e, pointer.x, pointer.y)
    },
    [onDrop]
  )

  return (
    <div className="flex-1 bg-gray-50 relative overflow-hidden">
      <Stage
        ref={stageRef}
        width={window.innerWidth - 512}
        height={window.innerHeight - 64}
        onDrop={handleDrop}
        onDragOver={(e) => e.evt.preventDefault()}
        onClick={() => selectComponent(null)}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={window.innerWidth - 512}
            height={window.innerHeight - 64}
            fill="#f8fafc"
          />
          
          {components.map((comp) => (
            <CircuitNode
              key={comp.id}
              component={comp}
              isSelected={selectedComponent === comp.id}
              onDragEnd={handleDragEnd(comp.id)}
              onClick={(e) => {
                e.cancelBubble = true
                selectComponent(comp.id)
              }}
            />
          ))}
        </Layer>
      </Stage>

      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-4xl mb-3">🔬</p>
            <p className="text-gray-400 text-sm">从左侧器材库拖拽器材到此处</p>
          </div>
        </div>
      )}
    </div>
  )
}
