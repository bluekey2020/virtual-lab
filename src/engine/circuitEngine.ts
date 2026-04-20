import { CircuitComponent } from '../types'

export interface CircuitAnalysisResult {
  totalVoltage: number
  totalResistance: number
  current: number
  componentCurrents: Record<string, number>
  componentVoltages: Record<string, number>
  bulbBrightness: Record<string, number>
}

function findBattery(components: CircuitComponent[]): CircuitComponent | null {
  return components.find((c) => c.type === 'battery') || null
}

function isSwitchClosed(components: CircuitComponent[]): boolean {
  const switchComp = components.find((c) => c.type === 'switch')
  return switchComp ? switchComp.properties.closed === 1 : true
}

function calculateTotalResistance(components: CircuitComponent[]): number {
  let resistance = 0
  components.forEach((c) => {
    if (c.type === 'resistor' || c.type === 'bulb') {
      resistance += c.properties.resistance || 0
    }
    if (c.type === 'ammeter') {
      resistance += 0.1
    }
  })
  return resistance || 0.001
}

export function analyzeCircuit(components: CircuitComponent[]): CircuitAnalysisResult {
  const battery = findBattery(components)
  const voltage = battery?.properties.voltage || 0
  const switchClosed = isSwitchClosed(components)

  if (!switchClosed || !battery) {
    return {
      totalVoltage: voltage,
      totalResistance: calculateTotalResistance(components),
      current: 0,
      componentCurrents: {},
      componentVoltages: {},
      bulbBrightness: {},
    }
  }

  const totalResistance = calculateTotalResistance(components)
  const current = voltage / totalResistance

  const componentCurrents: Record<string, number> = {}
  const componentVoltages: Record<string, number> = {}
  const bulbBrightness: Record<string, number> = {}

  components.forEach((c) => {
    if (c.type === 'ammeter') {
      componentCurrents[c.id] = current
    }
    if (c.type === 'resistor' || c.type === 'bulb') {
      componentVoltages[c.id] = current * (c.properties.resistance || 0)
      componentCurrents[c.id] = current
    }
    if (c.type === 'voltmeter') {
      const connectedResistor = components.find(
        (r) => (r.type === 'resistor' || r.type === 'bulb') && c.connections.includes(r.id)
      )
      if (connectedResistor) {
        componentVoltages[c.id] = current * (connectedResistor.properties.resistance || 0)
      }
    }
    if (c.type === 'bulb') {
      const power = current * current * (c.properties.resistance || 0)
      bulbBrightness[c.id] = Math.min(power / 2, 1)
    }
  })

  const errorMargin = 1 + (Math.random() - 0.5) * 0.01

  return {
    totalVoltage: voltage,
    totalResistance,
    current: current * errorMargin,
    componentCurrents,
    componentVoltages,
    bulbBrightness,
  }
}

export function calculatePower(voltage: number, current: number): number {
  return voltage * current
}
