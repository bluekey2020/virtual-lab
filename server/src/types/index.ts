export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  role: 'student' | 'teacher' | 'admin'
  schoolId: string
  grade?: string
  classNo?: string
  createdAt: string
  updatedAt: string
}

export interface Experiment {
  id: string
  title: string
  subject: string
  gradeLevel: string
  duration: number
  difficulty: number
  knowledgePoints: string[]
  steps: string[]
  equipmentList: string[]
  description?: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  experimentId: string
  description: string
  assignedBy: string
  assignedClass: string
  dueDate: string
  status: 'draft' | 'published' | 'expired'
  createdAt: string
}

export interface Report {
  id: string
  taskId?: string
  experimentId: string
  studentId: string
  studentName: string
  studentClass: string
  content: string
  dataRecords: any[]
  score?: number
  comment?: string
  status: 'draft' | 'submitted' | 'graded'
  submittedAt?: string
  gradedAt?: string
  gradedBy?: string
  createdAt: string
}

export interface LabSession {
  id: string
  studentId: string
  experimentId: string
  components: any[]
  wires: any[]
  dataRecords: any[]
  duration: number
  status: 'active' | 'completed' | 'abandoned'
  createdAt: string
  updatedAt: string
}

export interface AuthToken {
  userId: string
  role: string
  schoolId: string
}
