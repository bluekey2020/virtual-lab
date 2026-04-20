import { create } from 'zustand'
import type { CircuitComponent, ExperimentState } from '../types'

interface LabStore extends ExperimentState {
  setCurrentExperiment: (id: string) => void
  addComponent: (component: CircuitComponent) => void
  removeComponent: (id: string) => void
  updateComponent: (id: string, updates: Partial<CircuitComponent>) => void
  selectComponent: (id: string | null) => void
  setMeasurement: (key: string, value: number) => void
  toggleRunning: () => void
  setStepIndex: (index: number) => void
  resetExperiment: () => void
}

export const useLabStore = create<LabStore>((set) => ({
  currentExperiment: null,
  components: [],
  selectedComponent: null,
  measurements: {},
  isRunning: false,
  stepIndex: 0,

  setCurrentExperiment: (id) => set({ currentExperiment: id, components: [], measurements: {}, stepIndex: 0 }),
  
  addComponent: (component) =>
    set((state) => ({ components: [...state.components, component] })),

  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
    })),

  updateComponent: (id, updates) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  selectComponent: (id) => set({ selectedComponent: id }),

  setMeasurement: (key, value) =>
    set((state) => ({
      measurements: { ...state.measurements, [key]: value },
    })),

  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),

  setStepIndex: (index) => set({ stepIndex: index }),

  resetExperiment: () =>
    set({ components: [], measurements: {}, isRunning: false, stepIndex: 0, selectedComponent: null }),
}))
