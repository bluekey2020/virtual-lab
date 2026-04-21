import { Router } from 'express'
import { authenticate, type AuthRequest } from '../middleware/auth'
import { experiments as experimentData } from './experimentData'

const router = Router()

// 实验数据（从前端共享）
const experiments = experimentData

// 获取所有实验
router.get('/', (req, res) => {
  const { subject, grade } = req.query

  let filtered = experiments

  if (subject) {
    filtered = filtered.filter((e) => e.subject === subject)
  }
  if (grade) {
    filtered = filtered.filter((e) => e.gradeLevel.includes(grade as string))
  }

  res.json(filtered)
})

// 获取单个实验详情
router.get('/:id', (req, res) => {
  const experiment = experiments.find((e) => e.id === req.params.id)
  if (!experiment) {
    return res.status(404).json({ error: '实验不存在' })
  }
  res.json(experiment)
})

// 获取器材目录
router.get('/equipment/catalog', (req, res) => {
  const { equipmentCatalog } = require('./experimentData')
  res.json(equipmentCatalog)
})

export default router
