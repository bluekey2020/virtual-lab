export interface Equipment {
  id: string
  name: string
  category: string
  icon: string
  properties: Record<string, number | string>
  width: number
  height: number
}

export interface CircuitComponent {
  id: string
  type: string
  x: number
  y: number
  rotation: number
  properties: Record<string, number>
  connections: string[]
}

export interface Wire {
  id: string
  fromComponent: string
  fromPort: string
  toComponent: string
  toPort: string
}

export interface DataRecord {
  id: string
  timestamp: number
  values: Record<string, number>
  note?: string
}

export interface ExperimentState {
  currentExperiment: string | null
  components: CircuitComponent[]
  wires: Wire[]
  selectedComponent: string | null
  selectedWire: string | null
  measurements: Record<string, number>
  dataRecords: DataRecord[]
  isRunning: boolean
  stepIndex: number
}

export interface User {
  id: string
  name: string
  role: 'student' | 'teacher' | 'admin'
  schoolId: string
  grade?: string
  classNo?: string
}

export interface ExperimentRecord {
  id: string
  title: string
  subject: string
  gradeLevel: string
  duration: number
  difficulty: number
  knowledgePoints: string[]
  steps: string[]
  equipmentList: string[]
}
