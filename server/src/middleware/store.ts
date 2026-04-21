// In-memory store for development (replace with PostgreSQL in production)
import type { User, Task, Report, LabSession } from '../types'

export const users: User[] = []
export const tasks: Task[] = []
export const reports: Report[] = []
export const sessions: LabSession[] = []

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
