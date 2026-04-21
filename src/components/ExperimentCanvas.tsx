import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Stage, Layer, Rect, Circle, Group, Line } from 'react-konva'
import Konva from 'konva'
import { useLabStore } from '../store/labStore'
import { getComponent, getPortGlobalPosition } from '../plugins/ComponentPlugin'
import type { Wire } from '../types'

interface ExperimentCanvasProps {
  onDrop: (e: React.DragEvent, x: number, y: number) => void
}

/** 连接点组件 - 带悬停动画 */
const ConnectionPort: React.FC<{
  x: number
  y: number
  onDragStart: (e: any, portId: string, componentId: string) => void
  componentId: string
  portId: string
}> = ({ x, y, onDragStart, componentId, portId }) => {
  const [isHovered, setIsHovered] = useState(false)
  const circleRef = useRef<any>(null)

  useEffect(() => {
    if (circleRef.current) {
      const targetRadius = isHovered ? 8 : 6
      const targetFill = isHovered ? '#4f46e5' : '#6b7280'
      
      new Konva.Tween({
        node: circleRef.current,
        duration: 0.15,
        radius: targetRadius,
        fill: targetFill,
        easing: ((t: number) => t * (2 - t)) as any,
      }).play()
    }
  }, [isHovered])

  return (
    <Circle
      ref={circleRef}
      x={x}
      y={y}
      radius={6}
      fill="#6b7280"
      stroke="white"
      strokeWidth={2}
      draggable
      onDragStart={(e) => onDragStart(e, portId, componentId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  )
}

/** 导线渲染组件 - 带电流动画 */
const WireRenderer: React.FC<{
  wire: Wire
  isSelected: boolean
  isEnergized: boolean
  onClick: (e: any) => void
}> = ({ wire, isSelected, isEnergized, onClick }) => {
  const components = useLabStore((state) => state.components)
  const fromComp = components.find((c) => c.id === wire.fromComponent)
  const toComp = components.find((c) => c.id === wire.toComponent)

  if (!fromComp || !toComp) return null

  const fromPos = getPortGlobalPosition(fromComp, wire.fromPort)
  const toPos = getPortGlobalPosition(toComp, wire.toPort)

  if (!fromPos || !toPos) return null

  return (
    <Group onClick={onClick}>
      {/* 导线底色 */}
      <Line
        points={[fromPos.x, fromPos.y, toPos.x, toPos.y]}
        stroke={isSelected ? '#4f46e5' : '#374151'}
        strokeWidth={isSelected ? 3 : 2}
        dash={isSelected ? [6, 4] : []}
      />
      {/* 电流动画 */}
      {isEnergized && (
        <Line
          points={[fromPos.x, fromPos.y, toPos.x, toPos.y]}
          stroke="#22d3ee"
          strokeWidth={3}
          dash={[4, 8]}
          lineCap="round"
          lineJoin="round"
          shadowColor="#22d3ee"
          shadowBlur={6}
        />
      )}
      {/* 连接点 */}
      <Circle x={fromPos.x} y={fromPos.y} radius={3} fill="#374151" />
      <Circle x={toPos.x} y={toPos.y} radius={3} fill="#374151" />
    </Group>
  )
}

/** 组件渲染 - 带入场动画 */
const AnimatedComponent: React.FC<{
  comp: any
  plugin: any
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (e: any) => void
  onPortDragStart: (e: any, portId: string, componentId: string) => void
}> = ({ comp, plugin, isSelected, onSelect, onDragEnd, onPortDragStart }) => {
  const groupRef = useRef<any>(null)
  const [scale, setScale] = useState(0.3)
  const [opacity, setOpacity] = useState(0)

  // 入场动画
  useEffect(() => {
    const timeout = requestAnimationFrame(() => {
      setScale(1)
      setOpacity(1)
    })
    return () => cancelAnimationFrame(timeout)
  }, [])

  // 选中脉冲动画
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.to({
        scaleX: isSelected ? 1.05 : 1,
        scaleY: isSelected ? 1.05 : 1,
        duration: 0.2,
        easing: ((t: number) => t * (2 - t)) as any,
      })
    }
  }, [isSelected])

  return (
    <Group
      ref={groupRef}
      x={comp.x}
      y={comp.y}
      rotation={comp.rotation}
      scaleX={scale}
      scaleY={scale}
      opacity={opacity}
      draggable
      onDragEnd={onDragEnd}
      onClick={(e: any) => {
        e.cancelBubble = true
        onSelect()
      }}
    >
      {plugin.render(comp, isSelected)}
      {plugin.ports.map((port: any) => (
        <ConnectionPort
          key={port.id}
          x={port.x}
          y={port.y}
          componentId={comp.id}
          portId={port.id}
          onDragStart={onPortDragStart}
        />
      ))}
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
  const isRunning = useLabStore((state) => state.isRunning)

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

  // 删除功能
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

  const handlePortDragStart = useCallback((_e: any, portId: string, componentId: string) => {
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

  const handlePortDragMove = useCallback(() => {
    if (!wireDrawing) return
    const stage = stageRef.current
    if (!stage) return

    const pointer = stage.getPointerPosition()
    if (!pointer) return

    setWireDrawing((prev) => prev ? { ...prev, currentX: pointer.x, currentY: pointer.y } : null)
  }, [wireDrawing])

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
          {/* 网格背景 */}
          <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill="#f8fafc" />
          {Array.from({ length: Math.ceil(canvasSize.width / 40) }).map((_, i) => (
            <Line
              key={`vg-${i}`}
              points={[i * 40, 0, i * 40, canvasSize.height]}
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: Math.ceil(canvasSize.height / 40) }).map((_, i) => (
            <Line
              key={`hg-${i}`}
              points={[0, i * 40, canvasSize.width, i * 40]}
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
          ))}
          
          {/* 渲染导线 */}
          {wires.map((wire) => (
            <WireRenderer
              key={wire.id}
              wire={wire}
              isSelected={selectedWire === wire.id}
              isEnergized={isRunning}
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
              shadowColor="#4f46e5"
              shadowBlur={4}
            />
          )}
          
          {/* 渲染组件 - 带动画 */}
          {components.map((comp) => {
            const plugin = getComponent(comp.type)
            if (!plugin) return null

            return (
              <AnimatedComponent
                key={comp.id}
                comp={comp}
                plugin={plugin}
                isSelected={selectedComponent === comp.id}
                onSelect={() => selectComponent(comp.id)}
                onDragEnd={handleDragEnd(comp.id)}
                onPortDragStart={handlePortDragStart}
              />
            )
          })}
        </Layer>
      </Stage>

      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-4xl mb-3 animate-bounce">🔬</p>
            <p className="text-gray-400 text-sm">从左侧器材库拖拽器材到此处</p>
          </div>
        </div>
      )}
    </div>
  )
}
