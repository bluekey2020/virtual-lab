import type { CircuitComponent } from '../types'

/** 组件端口定义 */
export interface Port {
  id: string
  x: number
  y: number
  type: 'input' | 'output' | 'bidirectional'
}

/** 组件插件接口 */
export interface ComponentPlugin {
  /** 组件类型标识 */
  type: string
  /** 显示名称 */
  name: string
  /** 分类 */
  category: string
  /** 图标 emoji */
  icon: string
  /** 默认尺寸 */
  width: number
  height: number
  /** 默认属性 */
  defaultProperties: Record<string, number>
  /** 端口定义 */
  ports: Port[]
  /** 属性配置项（用于属性编辑面板） */
  propertyConfig: {
    key: string
    label: string
    min: number
    max: number
    step: number
    unit: string
  }[]
  /** 渲染函数 */
  render: (component: CircuitComponent, isSelected: boolean) => React.ReactNode
  /** 仿真计算（可选，覆盖默认行为） */
  simulate?: (component: CircuitComponent, allComponents: CircuitComponent[]) => Record<string, number>
}

/** 组件注册表 */
const registry = new Map<string, ComponentPlugin>()

export function registerComponent(plugin: ComponentPlugin): void {
  registry.set(plugin.type, plugin)
}

export function getComponent(type: string): ComponentPlugin | undefined {
  return registry.get(type)
}

export function getAllComponents(): ComponentPlugin[] {
  return Array.from(registry.values())
}

export function getComponentsByCategory(category: string): ComponentPlugin[] {
  return Array.from(registry.values()).filter((c) => c.category === category)
}

export function getAllCategories(): string[] {
  const categories = new Set<string>()
  registry.forEach((c) => categories.add(c.category))
  return Array.from(categories)
}

/** 获取组件的端口全局坐标 */
export function getPortGlobalPosition(component: CircuitComponent, portId: string): { x: number; y: number } | null {
  const plugin = getComponent(component.type)
  if (!plugin) return null

  const port = plugin.ports.find((p) => p.id === portId)
  if (!port) return null

  return {
    x: component.x + port.x,
    y: component.y + port.y,
  }
}
