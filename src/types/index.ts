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
  type: 'battery' | 'resistor' | 'switch' | 'ammeter' | 'voltmeter' | 'bulb' | 'wire'
  x: number
  y: number
  rotation: number
  properties: Record<string, number>
  connections: string[]
}

export interface ExperimentState {
  currentExperiment: string | null
  components: CircuitComponent[]
  selectedComponent: string | null
  measurements: Record<string, number>
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
