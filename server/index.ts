import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db';
import { authRouter } from './routes/auth';
import { opportunitiesRouter } from './routes/opportunities';
import { applicationsRouter } from './routes/applications';
import { studentsRouter } from './routes/students';
import { commonRouter } from './routes/common';
import { aiRouter } from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database schema and seed data
initDatabase();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Career Sync API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Route registration
app.use('/api/auth', authRouter);
app.use('/api/opportunities', opportunitiesRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/ai', aiRouter);
app.use('/api', commonRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Career Sync Backend API Server running at: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health\n`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

process.on('SIGTERM', () => {
  try { server.close(); } catch {}
  process.exit(0);
});

process.on('SIGINT', () => {
  try { server.close(); } catch {}
  process.exit(0);
});

