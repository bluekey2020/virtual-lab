import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Stage, Layer, Rect, Text, Circle, Group, Line } from 'react-konva'
import { useLabStore } from '../store/labStore'
import { getComponent, getAllComponents, getPortGlobalPosition } from '../plugins/ComponentPlugin'
import type { CircuitComponent, Wire } from '../types'

interface ExperimentCanvasProps {
  onDrop: (e: React.DragEvent, x: number, y: number) => void
}

/** 连接点组件 */
interface ConnectionPortProps {
  x: number
  y: number
  onDragStart: (e: any, portId: string, componentId: string) => void
  componentId: string
  portId: string
}

const ConnectionPort: React.FC<ConnectionPortProps> = ({ x, y, onDragStart, componentId, portId }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Circle
      x={x}
      y={y}
      radius={6}
      fill={isHovered ? '#4f46e5' : '#6b7280'}
      stroke="white"
      strokeWidth={2}
      draggable
      onDragStart={(e) => onDragStart(e, portId, componentId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  )
}

/** 导线渲染组件 */
interface WireRendererProps {
  wire: Wire
  isSelected: boolean
  onClick: () => void
}

const WireRenderer: React.FC<WireRendererProps> = ({ wire, isSelected, onClick }) => {
  const components = useLabStore((state) => state.components)
  const fromComp = components.find((c) => c.id === wire.fromComponent)
  const toComp = components.find((c) => c.id === wire.toComponent)

  if (!fromComp || !toComp) return null

  const fromPos = getPortGlobalPosition(fromComp, wire.fromPort)
  const toPos = getPortGlobalPosition(toComp, wire.toPort)

  if (!fromPos || !toPos) return null

  return (
    <Group onClick={onClick}>
      <Line
        points={[fromPos.x, fromPos.y, toPos.x, toPos.y]}
        stroke={isSelected ? '#4f46e5' : '#374151'}
        strokeWidth={isSelected ? 3 : 2}
        dash={isSelected ? [6, 4] : []}
      />
      <Circle x={fromPos.x} y={fromPos.y} radius={3} fill="#374151" />
      <Circle x={toPos.x} y={toPos.y} radius={3} fill="#374151" />
    </Group>
  )
}

export const ExperimentCanvas: React.FC<ExperimentCanvasProps> = ({ onDrop }) => {
  const stageRef = useRef<any>(null)
  const components = useLabStore((state) => state.components)
  const wires = useLabStore((state) => state.wires)
  const selectedComponent = useLabStore((state) => state.selectedComponent)
  const selectedWire = useLabStore((state) => state.selectedWire)
  const updateComponent = useLabStore((state) => state.updateComponent)
  const selectComponent = useLabStore((state) => state.selectComponent)
  const selectWire = useLabStore((state) => state.selectWire)
  const removeComponent = useLabStore((state) => state.removeComponent)
  const removeWire = useLabStore((state) => state.removeWire)

  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth - 512, height: window.innerHeight - 64 })

  // 响应式尺寸
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth - 512,
        height: window.innerHeight - 64,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 删除功能：键盘 Delete/Backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedComponent) {
          removeComponent(selectedComponent)
        } else if (selectedWire) {
          removeWire(selectedWire)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedComponent, selectedWire, removeComponent, removeWire])

  // 连线状态
  const [wireDrawing, setWireDrawing] = useState<{
    componentId: string
    portId: string
    startX: number
    startY: number
    currentX: number
    currentY: number
  } | null>(null)

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

  // 连线开始
  const handlePortDragStart = useCallback((e: any, portId: string, componentId: string) => {
    const stage = stageRef.current
    if (!stage) return

    const pointer = stage.getPointerPosition()
    if (!pointer) return

    setWireDrawing({
      componentId,
      portId,
      startX: pointer.x,
      startY: pointer.y,
      currentX: pointer.x,
      currentY: pointer.y,
    })
  }, [])

  // 连线移动
  const handlePortDragMove = useCallback((e: any) => {
    if (!wireDrawing) return
    const stage = stageRef.current
    if (!stage) return

    const pointer = stage.getPointerPosition()
    if (!pointer) return

    setWireDrawing((prev) => prev ? { ...prev, currentX: pointer.x, currentY: pointer.y } : null)
  }, [wireDrawing])

  // 连线结束
  const handlePortDragEnd = useCallback((e: any) => {
    if (!wireDrawing) return

    const stage = stageRef.current
    if (!stage) return

    const pointer = stage.getPointerPosition()
    if (!pointer) return

    // 查找目标连接点
    const targetShape = stage.getIntersection({ x: pointer.x, y: pointer.y })
    if (targetShape && targetShape.attrs.componentId && targetShape.attrs.portId) {
      const toComponentId = targetShape.attrs.componentId
      const toPortId = targetShape.attrs.portId

      // 避免自连和重复连接
      if (toComponentId !== wireDrawing.componentId) {
        const addWire = useLabStore.getState().addWire
        addWire({
          id: `wire_${Date.now()}`,
          fromComponent: wireDrawing.componentId,
          fromPort: wireDrawing.portId,
          toComponent: toComponentId,
          toPort: toPortId,
        })
      }
    }

    setWireDrawing(null)
  }, [wireDrawing])

  const allPlugins = getAllComponents()

  return (
    <div className="flex-1 bg-gray-50 relative overflow-hidden">
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onDrop={handleDrop}
        onDragOver={(e: any) => e.evt.preventDefault()}
        onClick={() => { selectComponent(null); selectWire(null) }}
        onMouseMove={handlePortDragMove}
      >
        <Layer>
          <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill="#f8fafc" />
          
          {/* 渲染导线 */}
          {wires.map((wire) => (
            <WireRenderer
              key={wire.id}
              wire={wire}
              isSelected={selectedWire === wire.id}
              onClick={(e: any) => {
                e.cancelBubble = true
                selectWire(wire.id)
              }}
            />
          ))}

          {/* 渲染临时连线 */}
          {wireDrawing && (
            <Line
              points={[wireDrawing.startX, wireDrawing.startY, wireDrawing.currentX, wireDrawing.currentY]}
              stroke="#4f46e5"
              strokeWidth={2}
              dash={[6, 4]}
            />
          )}
          
          {/* 渲染组件 */}
          {components.map((comp) => {
            const plugin = getComponent(comp.type)
            if (!plugin) return null

            return (
              <Group
                key={comp.id}
                x={comp.x}
                y={comp.y}
                rotation={comp.rotation}
                draggable
                onDragEnd={handleDragEnd(comp.id)}
                onClick={(e: any) => {
                  e.cancelBubble = true
                  selectComponent(comp.id)
                }}
              >
                {/* 使用插件渲染组件 */}
                {plugin.render(comp, selectedComponent === comp.id)}
                
                {/* 渲染连接点 */}
                {plugin.ports.map((port) => (
                  <ConnectionPort
                    key={port.id}
                    x={port.x}
                    y={port.y}
                    componentId={comp.id}
                    portId={port.id}
                    onDragStart={handlePortDragStart}
                  />
                ))}
              </Group>
            )
          })}
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
