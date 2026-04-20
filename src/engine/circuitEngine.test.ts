import { describe, it, expect } from 'vitest'
import { analyzeCircuit, calculatePower } from '../engine/circuitEngine'
import type { CircuitComponent } from '../types'

describe('circuitEngine', () => {
  it('should return zero current without battery', () => {
    const components: CircuitComponent[] = [
      {
        id: 'r1',
        type: 'resistor',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { resistance: 10 },
        connections: [],
      },
    ]

    const result = analyzeCircuit(components)
    expect(result.current).toBe(0)
    expect(result.totalVoltage).toBe(0)
  })

  it('should return zero current when switch is open', () => {
    const components: CircuitComponent[] = [
      {
        id: 'b1',
        type: 'battery',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { voltage: 3 },
        connections: [],
      },
      {
        id: 's1',
        type: 'switch',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { closed: 0 },
        connections: [],
      },
      {
        id: 'r1',
        type: 'resistor',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { resistance: 10 },
        connections: [],
      },
    ]

    const result = analyzeCircuit(components)
    expect(result.current).toBe(0)
  })

  it('should calculate correct current for simple circuit (Ohm\'s Law)', () => {
    const components: CircuitComponent[] = [
      {
        id: 'b1',
        type: 'battery',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { voltage: 12 },
        connections: [],
      },
      {
        id: 'r1',
        type: 'resistor',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { resistance: 100 },
        connections: [],
      },
    ]

    const result = analyzeCircuit(components)
    // I = U/R = 12/100 = 0.12A (with ±0.5% error margin)
    expect(result.current).toBeCloseTo(0.12, 1)
    expect(result.totalVoltage).toBe(12)
    expect(result.totalResistance).toBe(100)
  })

  it('should calculate correct voltage across resistor', () => {
    const components: CircuitComponent[] = [
      {
        id: 'b1',
        type: 'battery',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { voltage: 6 },
        connections: [],
      },
      {
        id: 'r1',
        type: 'resistor',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { resistance: 10 },
        connections: [],
      },
    ]

    const result = analyzeCircuit(components)
    // V = I * R, I = 6/10 = 0.6A, V = 0.6 * 10 = 6V
    expect(result.componentVoltages['r1']).toBeCloseTo(6, 0)
  })

  it('should calculate bulb brightness based on power', () => {
    const components: CircuitComponent[] = [
      {
        id: 'b1',
        type: 'battery',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { voltage: 6 },
        connections: [],
      },
      {
        id: 'bulb1',
        type: 'bulb',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { resistance: 5, brightness: 0 },
        connections: [],
      },
    ]

    const result = analyzeCircuit(components)
    // I = 6/5 = 1.2A, P = I²R = 1.44 * 5 = 7.2W
    // brightness = min(P/2, 1) = min(3.6, 1) = 1
    expect(result.bulbBrightness['bulb1']).toBe(1)
  })

  it('should calculate power correctly', () => {
    expect(calculatePower(12, 2)).toBe(24)
    expect(calculatePower(5, 0.5)).toBe(2.5)
    expect(calculatePower(0, 10)).toBe(0)
  })

  it('should include ammeter internal resistance', () => {
    const components: CircuitComponent[] = [
      {
        id: 'b1',
        type: 'battery',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { voltage: 10 },
        connections: [],
      },
      {
        id: 'a1',
        type: 'ammeter',
        x: 0,
        y: 0,
        rotation: 0,
        properties: { range: 1 },
        connections: [],
      },
    ]

    const result = analyzeCircuit(components)
    // Total resistance should include ammeter's 0.1Ω
    expect(result.totalResistance).toBe(0.1)
    expect(result.current).toBeCloseTo(100, 0) // 10/0.1 = 100A
  })
})
