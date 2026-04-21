import { Router } from 'express'
import { z } from 'zod'
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth'
import { reports, generateId } from '../middleware/store'
import type { Report } from '../types'

const router = Router()

const submitReportSchema = z.object({
  experimentId: z.string().min(1),
  taskId: z.string().optional(),
  content: z.string().min(1, '报告内容不能为空'),
  dataRecords: z.array(z.any()).optional(),
})

const gradeReportSchema = z.object({
  score: z.number().min(0).max(100),
  comment: z.string().optional(),
})

// 获取报告列表
router.get('/', authenticate, (req: AuthRequest, res) => {
  const { role, userId } = req.user!
  const { status } = req.query

  let filtered = reports

  if (role === 'student') {
    filtered = reports.filter((r) => r.studentId === userId)
  }
  // Teachers see all reports

  if (status) {
    filtered = filtered.filter((r) => r.status === status)
  }

  res.json(filtered)
})

// 获取单个报告详情
router.get('/:id', authenticate, (req: AuthRequest, res) => {
  const report = reports.find((r) => r.id === req.params.id)
  if (!report) {
    return res.status(404).json({ error: '报告不存在' })
  }

  // Students can only view their own reports
  if (req.user!.role === 'student' && report.studentId !== req.user!.userId) {
    return res.status(403).json({ error: '无权查看' })
  }

  res.json(report)
})

// 提交报告
router.post('/', authenticate, (req: AuthRequest, res) => {
  try {
    const data = submitReportSchema.parse(req.body)

    const report: Report = {
      id: generateId('report'),
      experimentId: data.experimentId,
      taskId: data.taskId,
      studentId: req.user!.userId,
      studentName: req.user!.userId, // Would be populated from user DB
      studentClass: '',
      content: data.content,
      dataRecords: data.dataRecords || [],
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    reports.push(report)
    res.status(201).json(report)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    res.status(500).json({ error: '提交报告失败' })
  }
})

// 批改报告（仅教师）
router.patch('/:id/grade', authenticate, requireRole('teacher'), (req: AuthRequest, res) => {
  const report = reports.find((r) => r.id === req.params.id)
  if (!report) {
    return res.status(404).json({ error: '报告不存在' })
  }

  try {
    const data = gradeReportSchema.parse(req.body)
    report.score = data.score
    report.comment = data.comment
    report.status = 'graded'
    report.gradedAt = new Date().toISOString()
    report.gradedBy = req.user!.userId

    res.json(report)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    res.status(500).json({ error: '批改失败' })
  }
})

// 删除报告
router.delete('/:id', authenticate, (req: AuthRequest, res) => {
  const idx = reports.findIndex((r) => {
    if (req.user!.role === 'student') return r.id === req.params.id && r.studentId === req.user!.userId
    return r.id === req.params.id
  })

  if (idx === -1) {
    return res.status(404).json({ error: '报告不存在' })
  }

  reports.splice(idx, 1)
  res.json({ message: '删除成功' })
})

export default router
