import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { generateId } from '../middleware/store'
import { generateToken, authenticate, type AuthRequest } from '../middleware/auth'
import { users } from '../middleware/store'
import type { User } from '../types'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  role: z.enum(['student', 'teacher']),
  schoolId: z.string().min(1, '学校编号不能为空'),
  grade: z.string().optional(),
  classNo: z.string().optional(),
})

const loginSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  schoolId: z.string().min(1, '请输入学校编号'),
  role: z.enum(['student', 'teacher']),
})

// 注册
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)

    // Check if user exists
    const existing = users.find(
      (u) => u.name === data.name && u.schoolId === data.schoolId && u.role === data.role
    )
    if (existing) {
      return res.status(409).json({ error: '该用户已注册' })
    }

    const passwordHash = await bcrypt.hash(generateId('pwd'), 10)
    const user: User = {
      id: generateId('user'),
      name: data.name,
      email: `${data.name}@virtuallab.local`,
      passwordHash,
      role: data.role,
      schoolId: data.schoolId,
      grade: data.grade,
      classNo: data.classNo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(user)

    const token = generateToken({
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId,
    })

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        schoolId: user.schoolId,
        grade: user.grade,
        classNo: user.classNo,
      },
      token,
    })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    res.status(500).json({ error: '注册失败' })
  }
})

// 登录（演示模式：无需密码）
router.post('/login', (req, res) => {
  try {
    const data = loginSchema.parse(req.body)

    // Find or create user (demo mode)
    let user = users.find(
      (u) => u.name === data.name && u.schoolId === data.schoolId && u.role === data.role
    )

    if (!user) {
      user = {
        id: generateId('user'),
        name: data.name,
        email: `${data.name}@virtuallab.local`,
        passwordHash: '',
        role: data.role,
        schoolId: data.schoolId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      users.push(user)
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId,
    })

    res.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        schoolId: user.schoolId,
        grade: user.grade,
        classNo: user.classNo,
      },
      token,
    })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message })
    }
    res.status(500).json({ error: '登录失败' })
  }
})

// 获取当前用户信息
router.get('/me', authenticate, (req: AuthRequest, res) => {
  const user = users.find((u) => u.id === req.user?.userId)
  if (!user) {
    return res.status(404).json({ error: '用户不存在' })
  }

  res.json({
    id: user.id,
    name: user.name,
    role: user.role,
    schoolId: user.schoolId,
    grade: user.grade,
    classNo: user.classNo,
    createdAt: user.createdAt,
  })
})

export default router
