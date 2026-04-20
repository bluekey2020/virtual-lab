import { describe, it, expect, beforeEach } from 'vitest'
import {
  registerComponent,
  getComponent,
  getAllComponents,
  getComponentsByCategory,
  getAllCategories,
  getPortGlobalPosition,
  type ComponentPlugin,
} from '../plugins/ComponentPlugin'
import type { CircuitComponent } from '../types'

describe('ComponentPlugin', () => {
  const mockPlugin: ComponentPlugin = {
    type: 'test-battery',
    name: '测试电源',
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
    render: () => null,
  }

  beforeEach(() => {
    // Clear registry by re-registering only mock
    // Note: In a real app, you'd want a clearRegistry function
  })

  it('should register a component plugin', () => {
    registerComponent(mockPlugin)
    const result = getComponent('test-battery')
    expect(result).toBeDefined()
    expect(result?.name).toBe('测试电源')
  })

  it('should return undefined for unregistered component', () => {
    const result = getComponent('nonexistent')
    expect(result).toBeUndefined()
  })

  it('should get all registered components', () => {
    const all = getAllComponents()
    expect(all.length).toBeGreaterThan(0)
  })

  it('should get components by category', () => {
    const powerComponents = getComponentsByCategory('电源类')
    expect(powerComponents.length).toBeGreaterThan(0)
    expect(powerComponents[0].category).toBe('电源类')
  })

  it('should get all categories', () => {
    const categories = getAllCategories()
    expect(categories.length).toBeGreaterThan(0)
    expect(categories).toContain('电源类')
  })

  it('should calculate port global position', () => {
    const component: CircuitComponent = {
      id: 'test-1',
      type: 'test-battery',
      x: 100,
      y: 200,
      rotation: 0,
      properties: { voltage: 3 },
      connections: [],
    }

    const leftPort = getPortGlobalPosition(component, 'left')
    expect(leftPort).toEqual({ x: 100, y: 225 })

    const rightPort = getPortGlobalPosition(component, 'right')
    expect(rightPort).toEqual({ x: 180, y: 225 })
  })

  it('should return null for invalid port', () => {
    const component: CircuitComponent = {
      id: 'test-1',
      type: 'test-battery',
      x: 100,
      y: 200,
      rotation: 0,
      properties: {},
      connections: [],
    }

    const result = getPortGlobalPosition(component, 'nonexistent')
    expect(result).toBeNull()
  })
})
