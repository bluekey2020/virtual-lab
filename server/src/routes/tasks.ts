import { Router } from 'express'
import { z } from 'zod'
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth'
import { tasks, generateId } from '../middleware/store'
import type { Task } from '../types'

const router = Router()

const createTaskSchema = z.object({
  title: z.string().min(1, '任务名称不能为空'),
  experimentId: z.string().min(1, '请选择实验'),
  description: z.string().optional(),
  assignedClass: z.string().optional(),
  dueDate: z.string().min(1, '请设置截止日期'),
})

// 获取所有任务（教师看自己创建的，学生看分配给自己的）
router.get('/', authenticate, (req: AuthRequest, res) => {
  const { role, userId } = req.user!

  let filtered = tasks

  if (role === 'teacher') {
    filtered = tasks.filter((t) => t.assignedBy === userId)
  }
  // Students see all published tasks

  res.json(filtered)
})

// 创建任务（仅教师）
router.post('/', authenticate, requireRole('teacher'), (req: AuthRequest, res) => {
  try {
    const data = createTaskSchema.parse(req.body)

    const task: Task = {
      id: generateId('task'),
      title: data.title,
      experimentId: data.experimentId,
      description: data.description || '',
      assignedBy: req.user!.userId,
      assignedClass: data.assignedClass || '',
      dueDate: data.dueDate,
      status: 'draft',
      createdAt: new Date().toISOString(),
    }

    tasks.push(task)
    res.status(201).json(task)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    res.status(500).json({ error: '创建任务失败' })
  }
})

// 更新任务
router.put('/:id', authenticate, requireRole('teacher'), (req: AuthRequest, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id && t.assignedBy === req.user!.userId)
  if (idx === -1) {
    return res.status(404).json({ error: '任务不存在' })
  }

  const data = createTaskSchema.partial().parse(req.body)
  tasks[idx] = { ...tasks[idx], ...data }
  res.json(tasks[idx])
})

// 发布任务
router.patch('/:id/publish', authenticate, requireRole('teacher'), (req: AuthRequest, res) => {
  const task = tasks.find((t) => t.id === req.params.id && t.assignedBy === req.user!.userId)
  if (!task) {
    return res.status(404).json({ error: '任务不存在' })
  }

  task.status = 'published'
  res.json(task)
})

// 删除任务
router.delete('/:id', authenticate, requireRole('teacher'), (req: AuthRequest, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id && t.assignedBy === req.user!.userId)
  if (idx === -1) {
    return res.status(404).json({ error: '任务不存在' })
  }

  tasks.splice(idx, 1)
  res.json({ message: '删除成功' })
})

export default router
