import { create } from 'zustand'
import type { CircuitComponent, Wire, DataRecord, ExperimentState } from '../types'

interface LabStore extends ExperimentState {
  setCurrentExperiment: (id: string) => void
  addComponent: (component: CircuitComponent) => void
  removeComponent: (id: string) => void
  updateComponent: (id: string, updates: Partial<CircuitComponent>) => void
  selectComponent: (id: string | null) => void
  selectWire: (id: string | null) => void
  setMeasurement: (key: string, value: number) => void
  toggleRunning: () => void
  setStepIndex: (index: number) => void
  resetExperiment: () => void
  // Wire operations
  addWire: (wire: Wire) => void
  removeWire: (id: string) => void
  // Data recording
  addDataRecord: (record: DataRecord) => void
  removeDataRecord: (id: string) => void
  clearDataRecords: () => void
  // Load from localStorage
  loadFromStorage: () => void
}

const STORAGE_KEY = 'virtual-lab-state'

function saveToStorage(state: Partial<LabStore>) {
  try {
    const data = {
      currentExperiment: state.currentExperiment,
      components: state.components,
      wires: state.wires,
      measurements: state.measurements,
      dataRecords: state.dataRecords,
      stepIndex: state.stepIndex,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

export const useLabStore = create<LabStore>((set, get) => ({
  currentExperiment: null,
  components: [],
  wires: [],
  selectedComponent: null,
  selectedWire: null,
  measurements: {},
  dataRecords: [],
  isRunning: false,
  stepIndex: 0,

  setCurrentExperiment: (id) => {
    set({ currentExperiment: id, components: [], wires: [], measurements: {}, stepIndex: 0, dataRecords: [] })
    saveToStorage(get())
  },
  
  addComponent: (component) => {
    set((state) => ({ components: [...state.components, component] }))
    saveToStorage(get())
  },

  removeComponent: (id) => {
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      wires: state.wires.filter((w) => w.fromComponent !== id && w.toComponent !== id),
      selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
    }))
    saveToStorage(get())
  },

  updateComponent: (id, updates) => {
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }))
    saveToStorage(get())
  },

  selectComponent: (id) => set({ selectedComponent: id, selectedWire: null }),
  selectWire: (id) => set({ selectedWire: id, selectedComponent: null }),

  setMeasurement: (key, value) => {
    set((state) => ({
      measurements: { ...state.measurements, [key]: value },
    }))
    saveToStorage(get())
  },

  toggleRunning: () => {
    set((state) => ({ isRunning: !state.isRunning }))
    saveToStorage(get())
  },

  setStepIndex: (index) => {
    set({ stepIndex: index })
    saveToStorage(get())
  },

  resetExperiment: () => {
    set({ components: [], wires: [], measurements: {}, isRunning: false, stepIndex: 0, selectedComponent: null, selectedWire: null, dataRecords: [] })
    saveToStorage(get())
  },

  // Wire operations
  addWire: (wire) => {
    set((state) => ({ wires: [...state.wires, wire] }))
    saveToStorage(get())
  },

  removeWire: (id) => {
    set((state) => ({
      wires: state.wires.filter((w) => w.id !== id),
      selectedWire: state.selectedWire === id ? null : state.selectedWire,
    }))
    saveToStorage(get())
  },

  // Data recording
  addDataRecord: (record) => {
    set((state) => ({ dataRecords: [...state.dataRecords, record] }))
    saveToStorage(get())
  },

  removeDataRecord: (id) => {
    set((state) => ({
      dataRecords: state.dataRecords.filter((r) => r.id !== id),
    }))
    saveToStorage(get())
  },

  clearDataRecords: () => {
    set({ dataRecords: [] })
    saveToStorage(get())
  },

  // Load from localStorage
  loadFromStorage: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        set({
          currentExperiment: parsed.currentExperiment ?? null,
          components: parsed.components ?? [],
          wires: parsed.wires ?? [],
          measurements: parsed.measurements ?? {},
          dataRecords: parsed.dataRecords ?? [],
          stepIndex: parsed.stepIndex ?? 0,
        })
      }
    } catch {
      // Ignore storage errors
    }
  },
}))
