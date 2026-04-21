import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/auth'
import experimentRoutes from './routes/experiments'
import taskRoutes from './routes/tasks'
import reportRoutes from './routes/reports'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}))
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(morgan('dev'))
app.use(express.json())

// Handle preflight OPTIONS requests
app.options('*', cors())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/experiments', experimentRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/reports', reportRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Virtual Lab Server running on port ${PORT}`)
  console.log(`📡 API: http://localhost:${PORT}/api`)
})
