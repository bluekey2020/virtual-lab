import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import type { AuthToken } from '../types'

const JWT_SECRET = process.env.JWT_SECRET || 'virtual-lab-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export function generateToken(payload: AuthToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): AuthToken {
  return jwt.verify(token, JWT_SECRET) as AuthToken
}

export interface AuthRequest extends Request {
  user?: AuthToken
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供认证令牌' })
  }

  try {
    const token = authHeader.split(' ')[1]
    req.user = verifyToken(token)
    next()
  } catch {
    return res.status(401).json({ error: '无效的认证令牌' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: '未认证' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: '权限不足' })
    }
    next()
  }
}
