import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import cors from 'cors';
import { connectDB } from './server/db';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Import API routers
import authRouter from './server/routes/auth';
import eventsRouter from './server/routes/events';
import teamsRouter from './server/routes/teams';
import membersRouter from './server/routes/members';
import queriesRouter from './server/routes/queries';
import usersRouter from './server/routes/users';
import announcementsRouter from './server/routes/announcements';
import eventRegistrationsRouter from './server/routes/eventRegistrations';
import developersRouter from './server/routes/developers';
import feedbackRouter from './server/routes/feedback';



export const app = express();

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api', (req, res, next) => {
  console.log(`[API Req] ${req.method} ${req.url}`);
  next();
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error('DB Connection Error:', error);
    res.status(500).json({ success: false, message: 'Database connection failed', error: error.message || 'Unknown DB error' });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/members', membersRouter);
app.use('/api/queries', queriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/event-registrations', eventRegistrationsRouter);
app.use('/api/developers', developersRouter);
app.use('/api/feedback', feedbackRouter);

app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ status: 'ok', dbConnected: isConnected });
});

// Global API error handler
app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message || 'Unknown error' });
});

async function startLocalServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Only start the server locally if not running in a Vercel environment
if (process.env.NODE_ENV !== 'production' || (!process.env.VERCEL && !process.env.VERCEL_ENV)) {
  startLocalServer();
}

export default app;
