import { describe, it, expect, beforeEach } from 'vitest'
import { useLabStore } from './labStore'
import type { CircuitComponent, Wire, DataRecord } from '../types'

describe('labStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useLabStore.setState({
      currentExperiment: null,
      components: [],
      wires: [],
      selectedComponent: null,
      selectedWire: null,
      measurements: {},
      dataRecords: [],
      isRunning: false,
      stepIndex: 0,
    })
  })

  it('should have initial state', () => {
    const state = useLabStore.getState()
    expect(state.currentExperiment).toBeNull()
    expect(state.components).toEqual([])
    expect(state.wires).toEqual([])
    expect(state.selectedComponent).toBeNull()
    expect(state.isRunning).toBe(false)
  })

  it('should set current experiment', () => {
    useLabStore.getState().setCurrentExperiment('ohm-law')
    expect(useLabStore.getState().currentExperiment).toBe('ohm-law')
  })

  it('should add and remove component', () => {
    const comp: CircuitComponent = {
      id: 'comp_1',
      type: 'battery',
      x: 100,
      y: 100,
      rotation: 0,
      properties: { voltage: 3 },
      connections: [],
    }

    useLabStore.getState().addComponent(comp)
    expect(useLabStore.getState().components).toHaveLength(1)
    expect(useLabStore.getState().components[0].type).toBe('battery')

    useLabStore.getState().removeComponent('comp_1')
    expect(useLabStore.getState().components).toHaveLength(0)
  })

  it('should update component properties', () => {
    const comp: CircuitComponent = {
      id: 'comp_1',
      type: 'resistor',
      x: 100,
      y: 100,
      rotation: 0,
      properties: { resistance: 10 },
      connections: [],
    }

    useLabStore.getState().addComponent(comp)
    useLabStore.getState().updateComponent('comp_1', { properties: { resistance: 20 } })

    const updated = useLabStore.getState().components[0]
    expect(updated.properties.resistance).toBe(20)
  })

  it('should add and remove wire', () => {
    const wire: Wire = {
      id: 'wire_1',
      fromComponent: 'comp_1',
      fromPort: 'right',
      toComponent: 'comp_2',
      toPort: 'left',
    }

    useLabStore.getState().addWire(wire)
    expect(useLabStore.getState().wires).toHaveLength(1)

    useLabStore.getState().removeWire('wire_1')
    expect(useLabStore.getState().wires).toHaveLength(0)
  })

  it('should remove wires when component is deleted', () => {
    const wire: Wire = {
      id: 'wire_1',
      fromComponent: 'comp_1',
      fromPort: 'right',
      toComponent: 'comp_2',
      toPort: 'left',
    }

    useLabStore.getState().addWire(wire)
    useLabStore.getState().removeComponent('comp_1')

    expect(useLabStore.getState().wires).toHaveLength(0)
  })

  it('should select component and wire', () => {
    useLabStore.getState().selectComponent('comp_1')
    expect(useLabStore.getState().selectedComponent).toBe('comp_1')
    expect(useLabStore.getState().selectedWire).toBeNull()

    useLabStore.getState().selectWire('wire_1')
    expect(useLabStore.getState().selectedWire).toBe('wire_1')
    expect(useLabStore.getState().selectedComponent).toBeNull()
  })

  it('should toggle running state', () => {
    expect(useLabStore.getState().isRunning).toBe(false)
    useLabStore.getState().toggleRunning()
    expect(useLabStore.getState().isRunning).toBe(true)
    useLabStore.getState().toggleRunning()
    expect(useLabStore.getState().isRunning).toBe(false)
  })

  it('should add and remove data records', () => {
    const record: DataRecord = {
      id: 'record_1',
      timestamp: Date.now(),
      values: { voltage: 3, current: 0.3, resistance: 10 },
      note: 'Test record',
    }

    useLabStore.getState().addDataRecord(record)
    expect(useLabStore.getState().dataRecords).toHaveLength(1)

    useLabStore.getState().removeDataRecord('record_1')
    expect(useLabStore.getState().dataRecords).toHaveLength(0)
  })

  it('should clear all data records', () => {
    useLabStore.getState().addDataRecord({
      id: 'record_1',
      timestamp: Date.now(),
      values: { voltage: 3 },
    })
    useLabStore.getState().addDataRecord({
      id: 'record_2',
      timestamp: Date.now(),
      values: { voltage: 5 },
    })

    useLabStore.getState().clearDataRecords()
    expect(useLabStore.getState().dataRecords).toHaveLength(0)
  })

  it('should reset experiment', () => {
    useLabStore.getState().addComponent({
      id: 'comp_1',
      type: 'battery',
      x: 100,
      y: 100,
      rotation: 0,
      properties: {},
      connections: [],
    })
    useLabStore.getState().toggleRunning()
    useLabStore.getState().setStepIndex(2)

    useLabStore.getState().resetExperiment()
    const state = useLabStore.getState()
    expect(state.components).toHaveLength(0)
    expect(state.wires).toHaveLength(0)
    expect(state.isRunning).toBe(false)
    expect(state.stepIndex).toBe(0)
    expect(state.selectedComponent).toBeNull()
  })
})
