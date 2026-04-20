import React from 'react'
import { Rect, Text, Circle, Group } from 'react-konva'
import { registerComponent, type ComponentPlugin } from './ComponentPlugin'
import type { CircuitComponent } from '../types'

/** 电源组件插件 */
const BatteryPlugin: ComponentPlugin = {
  type: 'battery',
  name: '电源',
  category: '电源类',
  icon: '🔋',
  width: 80,
  height: 50,
  defaultProperties: { voltage: 3 },
  ports: [
    { id: 'left', x: 0, y: 25, type: 'bidirectional' },
    { id: 'right', x: 80, y: 25, type: 'bidirectional' },
  ],
  propertyConfig: [
    { key: 'voltage', label: '电压', min: 0, max: 24, step: 0.1, unit: 'V' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => {
    return (
      <Group>
        <Rect width={80} height={50} fill="#3b82f6" cornerRadius={6} opacity={0.9} />
        <Text text="+" x={10} y={15} fontSize={18} fill="white" fontStyle="bold" />
        <Text text="-" x={60} y={15} fontSize={18} fill="white" fontStyle="bold" />
        <Text text={`${component.properties.voltage ?? 3}V`} x={25} y={30} fontSize={10} fill="white" />
        {isSelected && (
          <Rect
            width={80}
            height={50}
            stroke="#4f46e5"
            strokeWidth={2}
            dash={[4, 4]}
            cornerRadius={6}
          />
        )}
      </Group>
    )
  },
}

/** 电阻组件插件 */
const ResistorPlugin: ComponentPlugin = {
  type: 'resistor',
  name: '定值电阻',
  category: '元件类',
  icon: '⚡',
  width: 80,
  height: 30,
  defaultProperties: { resistance: 10 },
  ports: [
    { id: 'left', x: 0, y: 15, type: 'bidirectional' },
    { id: 'right', x: 80, y: 15, type: 'bidirectional' },
  ],
  propertyConfig: [
    { key: 'resistance', label: '电阻', min: 0.1, max: 1000, step: 0.1, unit: 'Ω' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => {
    return (
      <Group>
        <Rect width={80} height={30} fill="#f59e0b" cornerRadius={4} opacity={0.9} />
        <Text text={`${component.properties.resistance ?? 10}Ω`} x={20} y={8} fontSize={11} fill="white" />
        {isSelected && (
          <Rect
            width={80}
            height={30}
            stroke="#4f46e5"
            strokeWidth={2}
            dash={[4, 4]}
            cornerRadius={4}
          />
        )}
      </Group>
    )
  },
}

/** 开关组件插件 */
const SwitchPlugin: ComponentPlugin = {
  type: 'switch',
  name: '开关',
  category: '控制类',
  icon: '🔘',
  width: 60,
  height: 40,
  defaultProperties: { closed: 0 },
  ports: [
    { id: 'left', x: 0, y: 20, type: 'bidirectional' },
    { id: 'right', x: 60, y: 20, type: 'bidirectional' },
  ],
  propertyConfig: [],
  render: (component: CircuitComponent, isSelected: boolean) => {
    const isClosed = component.properties.closed === 1
    return (
      <Group>
        <Rect width={60} height={40} fill={isClosed ? '#10b981' : '#ef4444'} cornerRadius={6} opacity={0.9} />
        <Text text={isClosed ? '闭合' : '断开'} x={15} y={12} fontSize={12} fill="white" />
        {isSelected && (
          <Rect
            width={60}
            height={40}
            stroke="#4f46e5"
            strokeWidth={2}
            dash={[4, 4]}
            cornerRadius={6}
          />
        )}
      </Group>
    )
  },
}

/** 电流表组件插件 */
const AmmeterPlugin: ComponentPlugin = {
  type: 'ammeter',
  name: '电流表',
  category: '测量类',
  icon: '📊',
  width: 70,
  height: 70,
  defaultProperties: { range: 1 },
  ports: [
    { id: 'left', x: 0, y: 35, type: 'input' },
    { id: 'right', x: 70, y: 35, type: 'output' },
  ],
  propertyConfig: [
    { key: 'range', label: '量程', min: 0.1, max: 10, step: 0.1, unit: 'A' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => {
    return (
      <Group>
        <Circle x={35} y={35} radius={35} fill="#10b981" opacity={0.9} />
        <Text text="A" x={28} y={25} fontSize={20} fill="white" fontStyle="bold" />
        {isSelected && (
          <Circle
            x={35}
            y={35}
            radius={35}
            stroke="#4f46e5"
            strokeWidth={2}
            dash={[4, 4]}
          />
        )}
      </Group>
    )
  },
}

/** 电压表组件插件 */
const VoltmeterPlugin: ComponentPlugin = {
  type: 'voltmeter',
  name: '电压表',
  category: '测量类',
  icon: '📊',
  width: 70,
  height: 70,
  defaultProperties: { range: 10 },
  ports: [
    { id: 'left', x: 0, y: 35, type: 'input' },
    { id: 'right', x: 70, y: 35, type: 'output' },
  ],
  propertyConfig: [
    { key: 'range', label: '量程', min: 1, max: 100, step: 1, unit: 'V' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => {
    return (
      <Group>
        <Circle x={35} y={35} radius={35} fill="#8b5cf6" opacity={0.9} />
        <Text text="V" x={28} y={25} fontSize={20} fill="white" fontStyle="bold" />
        {isSelected && (
          <Circle
            x={35}
            y={35}
            radius={35}
            stroke="#4f46e5"
            strokeWidth={2}
            dash={[4, 4]}
          />
        )}
      </Group>
    )
  },
}

/** 灯泡组件插件 */
const BulbPlugin: ComponentPlugin = {
  type: 'bulb',
  name: '小灯泡',
  category: '元件类',
  icon: '💡',
  width: 50,
  height: 50,
  defaultProperties: { resistance: 5, brightness: 0 },
  ports: [
    { id: 'left', x: 0, y: 25, type: 'bidirectional' },
    { id: 'right', x: 50, y: 25, type: 'bidirectional' },
  ],
  propertyConfig: [
    { key: 'resistance', label: '电阻', min: 0.1, max: 100, step: 0.1, unit: 'Ω' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => {
    const brightness = component.properties.brightness ?? 0
    return (
      <Group>
        <Circle x={25} y={25} radius={25} fill="#fbbf24" opacity={0.6 + brightness * 0.4} />
        <Text text="💡" x={12} y={12} fontSize={24} />
        {isSelected && (
          <Circle
            x={25}
            y={25}
            radius={25}
            stroke="#4f46e5"
            strokeWidth={2}
            dash={[4, 4]}
          />
        )}
      </Group>
    )
  },
}

/** 注册所有内置组件 */
export function registerAllComponents(): void {
  registerComponent(BatteryPlugin)
  registerComponent(ResistorPlugin)
  registerComponent(SwitchPlugin)
  registerComponent(AmmeterPlugin)
  registerComponent(VoltmeterPlugin)
  registerComponent(BulbPlugin)
}
