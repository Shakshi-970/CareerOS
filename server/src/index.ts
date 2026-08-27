import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import reportRouter from './routes/report.route.js'
import profileRouter from './routes/profile.route.js'
import interviewRouter from './routes/interview.route.js'
import jobsRouter from './routes/jobs.route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3001

const CLIENT_URL = process.env.CLIENT_URL ?? ''

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true)
    if (CLIENT_URL && origin === CLIENT_URL) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  }
}))
app.use(express.json({ limit: '10mb' }))

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'CareerOS API running' }, error: null })
})

app.use('/api/v1/report', reportRouter)
app.use('/api/v1/profile', profileRouter)
app.use('/api/v1/interview', interviewRouter)
app.use('/api/v1/jobs', jobsRouter)

app.listen(PORT, () => {
  console.log(`CareerOS server running on http://localhost:${PORT}`)
})
