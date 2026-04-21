import { Rect, Text, Circle, Group, Line } from 'react-konva'
import { registerComponent, type ComponentPlugin } from '../ComponentPlugin'
import type { CircuitComponent } from '../../types'

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
          <Rect width={80} height={50} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={6} />
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
          <Rect width={80} height={30} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={4} />
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
          <Rect width={60} height={40} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={6} />
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
  render: (_component: CircuitComponent, isSelected: boolean) => {
    return (
      <Group>
        <Circle x={35} y={35} radius={35} fill="#10b981" opacity={0.9} />
        <Text text="A" x={28} y={25} fontSize={20} fill="white" fontStyle="bold" />
        {isSelected && (
          <Circle x={35} y={35} radius={35} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} />
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
  render: (_component: CircuitComponent, isSelected: boolean) => {
    return (
      <Group>
        <Circle x={35} y={35} radius={35} fill="#8b5cf6" opacity={0.9} />
        <Text text="V" x={28} y={25} fontSize={20} fill="white" fontStyle="bold" />
        {isSelected && (
          <Circle x={35} y={35} radius={35} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} />
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
          <Circle x={25} y={25} radius={25} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} />
        )}
      </Group>
    )
  },
}

// ===== 力学组件 =====

/** 小车组件 */
const CartPlugin: ComponentPlugin = {
  type: 'cart',
  name: '小车',
  category: '力学类',
  icon: '🚗',
  width: 80,
  height: 40,
  defaultProperties: { mass: 0.5 },
  ports: [
    { id: 'front', x: 80, y: 20, type: 'bidirectional' },
    { id: 'back', x: 0, y: 20, type: 'bidirectional' },
  ],
  propertyConfig: [
    { key: 'mass', label: '质量', min: 0.1, max: 5, step: 0.1, unit: 'kg' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => (
    <Group>
      <Rect width={80} height={25} fill="#6366f1" cornerRadius={4} opacity={0.9} />
      <Circle x={20} y={32} radius={8} fill="#374151" />
      <Circle x={60} y={32} radius={8} fill="#374151" />
      <Text text={`${component.properties.mass ?? 0.5}kg`} x={15} y={6} fontSize={10} fill="white" />
      {isSelected && (
        <Rect width={80} height={40} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={4} />
      )}
    </Group>
  ),
}

/** 滑轮组件 */
const PulleyPlugin: ComponentPlugin = {
  type: 'pulley',
  name: '滑轮',
  category: '力学类',
  icon: '⚙️',
  width: 40,
  height: 40,
  defaultProperties: {},
  ports: [
    { id: 'top', x: 20, y: 0, type: 'bidirectional' },
    { id: 'left', x: 0, y: 20, type: 'bidirectional' },
    { id: 'right', x: 40, y: 20, type: 'bidirectional' },
  ],
  propertyConfig: [],
  render: (_component: CircuitComponent, isSelected: boolean) => (
    <Group>
      <Circle x={20} y={20} radius={18} fill="#9ca3af" opacity={0.9} />
      <Circle x={20} y={20} radius={6} fill="#4b5563" />
      {isSelected && (
        <Circle x={20} y={20} radius={18} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} />
      )}
    </Group>
  ),
}

/** 砝码组件 */
const WeightPlugin: ComponentPlugin = {
  type: 'weight',
  name: '砝码',
  category: '力学类',
  icon: '⚖️',
  width: 40,
  height: 50,
  defaultProperties: { mass: 0.1 },
  ports: [
    { id: 'top', x: 20, y: 0, type: 'bidirectional' },
  ],
  propertyConfig: [
    { key: 'mass', label: '质量', min: 0.01, max: 1, step: 0.01, unit: 'kg' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => (
    <Group>
      <Rect x={5} y={10} width={30} height={35} fill="#78716c" cornerRadius={3} opacity={0.9} />
      <Rect x={15} y={0} width={10} height={12} fill="#a8a29e" cornerRadius={2} />
      <Text text={`${component.properties.mass ?? 0.1}`} x={8} y={25} fontSize={9} fill="white" />
      {isSelected && (
        <Rect x={5} y={0} width={30} height={50} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={3} />
      )}
    </Group>
  ),
}

// ===== 光学组件 =====

/** 光源组件 */
const LightSourcePlugin: ComponentPlugin = {
  type: 'light-source',
  name: '光源',
  category: '光学类',
  icon: '🔦',
  width: 60,
  height: 40,
  defaultProperties: { wavelength: 550 },
  ports: [
    { id: 'right', x: 60, y: 20, type: 'output' },
  ],
  propertyConfig: [
    { key: 'wavelength', label: '波长', min: 380, max: 780, step: 10, unit: 'nm' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => (
    <Group>
      <Rect width={60} height={40} fill="#f59e0b" cornerRadius={6} opacity={0.9} />
      <Text text="💡" x={18} y={8} fontSize={22} />
      <Text text={`${component.properties.wavelength ?? 550}nm`} x={5} y={28} fontSize={8} fill="white" />
      {isSelected && (
        <Rect width={60} height={40} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={6} />
      )}
    </Group>
  ),
}

/** 凸透镜组件 */
const ConvexLensPlugin: ComponentPlugin = {
  type: 'convex-lens',
  name: '凸透镜',
  category: '光学类',
  icon: '🔍',
  width: 40,
  height: 60,
  defaultProperties: { focalLength: 10 },
  ports: [
    { id: 'left', x: 0, y: 30, type: 'bidirectional' },
    { id: 'right', x: 40, y: 30, type: 'bidirectional' },
  ],
  propertyConfig: [
    { key: 'focalLength', label: '焦距', min: 5, max: 50, step: 1, unit: 'cm' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => (
    <Group>
      <Rect x={10} y={0} width={20} height={60} fill="#60a5fa" cornerRadius={10} opacity={0.7} />
      <Text text="f=" x={8} y={22} fontSize={9} fill="#1e40af" />
      <Text text={`${component.properties.focalLength ?? 10}`} x={8} y={34} fontSize={9} fill="#1e40af" />
      {isSelected && (
        <Rect x={10} y={0} width={20} height={60} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={10} />
      )}
    </Group>
  ),
}

// ===== 化学组件 =====

/** 烧杯组件 */
const BeakerPlugin: ComponentPlugin = {
  type: 'beaker',
  name: '烧杯',
  category: '化学类',
  icon: '🥛',
  width: 60,
  height: 70,
  defaultProperties: { volume: 250, liquidLevel: 0 },
  ports: [
    { id: 'top', x: 30, y: 0, type: 'bidirectional' },
  ],
  propertyConfig: [
    { key: 'volume', label: '容量', min: 50, max: 1000, step: 50, unit: 'mL' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => (
    <Group>
      <Rect x={5} y={10} width={50} height={55} fill="#e0f2fe" cornerRadius={3} opacity={0.6} />
      <Line points={[0, 10, 5, 10, 5, 65, 55, 65, 55, 10, 60, 10]} stroke="#94a3b8" strokeWidth={2} />
      <Text text={`${component.properties.volume ?? 250}mL`} x={8} y={35} fontSize={9} fill="#0369a1" />
      {isSelected && (
        <Rect x={0} y={0} width={60} height={70} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={3} />
      )}
    </Group>
  ),
}

/** 试管组件 */
const TestTubePlugin: ComponentPlugin = {
  type: 'test-tube',
  name: '试管',
  category: '化学类',
  icon: '🧪',
  width: 30,
  height: 80,
  defaultProperties: { volume: 15 },
  ports: [
    { id: 'top', x: 15, y: 0, type: 'bidirectional' },
  ],
  propertyConfig: [
    { key: 'volume', label: '容量', min: 5, max: 50, step: 5, unit: 'mL' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => (
    <Group>
      <Rect x={5} y={0} width={20} height={70} fill="#e0f2fe" cornerRadius={10} opacity={0.6} />
      <Line points={[5, 0, 5, 60, 25, 60, 25, 0]} stroke="#94a3b8" strokeWidth={2} />
      <Text text={`${component.properties.volume ?? 15}mL`} x={2} y={35} fontSize={7} fill="#0369a1" />
      {isSelected && (
        <Rect x={0} y={0} width={30} height={80} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={10} />
      )}
    </Group>
  ),
}

/** 锥形瓶组件 */
const ConicalFlaskPlugin: ComponentPlugin = {
  type: 'conical-flask',
  name: '锥形瓶',
  category: '化学类',
  icon: '⚗️',
  width: 60,
  height: 80,
  defaultProperties: { volume: 250 },
  ports: [
    { id: 'top', x: 30, y: 0, type: 'bidirectional' },
  ],
  propertyConfig: [
    { key: 'volume', label: '容量', min: 100, max: 500, step: 50, unit: 'mL' },
  ],
  render: (component: CircuitComponent, isSelected: boolean) => (
    <Group>
      <Rect x={20} y={0} width={20} height={25} fill="#e0f2fe" opacity={0.6} />
      <Line points={[20, 25, 5, 75, 55, 75, 40, 25]} stroke="#94a3b8" strokeWidth={2} />
      <Text text={`${component.properties.volume ?? 250}mL`} x={8} y={50} fontSize={8} fill="#0369a1" />
      {isSelected && (
        <Rect x={0} y={0} width={60} height={80} stroke="#4f46e5" strokeWidth={2} dash={[4, 4]} cornerRadius={3} />
      )}
    </Group>
  ),
}

/** 注册所有内置组件 */
export function registerAllComponents(): void {
  // 电路组件
  registerComponent(BatteryPlugin)
  registerComponent(ResistorPlugin)
  registerComponent(SwitchPlugin)
  registerComponent(AmmeterPlugin)
  registerComponent(VoltmeterPlugin)
  registerComponent(BulbPlugin)
  // 力学组件
  registerComponent(CartPlugin)
  registerComponent(PulleyPlugin)
  registerComponent(WeightPlugin)
  // 光学组件
  registerComponent(LightSourcePlugin)
  registerComponent(ConvexLensPlugin)
  // 化学组件
  registerComponent(BeakerPlugin)
  registerComponent(TestTubePlugin)
  registerComponent(ConicalFlaskPlugin)
}
