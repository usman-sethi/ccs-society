import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { connectDB } from './server/db';

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

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

export const app = express();

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for all origins, or you can restrict it to your Vercel URL
app.use(cors({
    origin: '*', // CHANGE THIS to your Vercel URL in production, e.g., ['https://your-vercel-app.vercel.app']
    credentials: true
}));

// Setup DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error('DB Connection Error:', error);
    res.status(500).json({ success: false, message: 'Database connection failed', error: error.message || 'Unknown DB error' });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/members', membersRouter);
app.use('/api/queries', queriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/event-registrations', eventRegistrationsRouter);
app.use('/api/developers', developersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV, "db": "connected" });
});

app.get('/', (req, res) => {
  res.json({ message: 'CCS Backend API is running perfectly!', health: '/api/health' });
});

// Global API error handler
app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message || 'Unknown error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Standalone Backend API Server running on port ${PORT}`);
});
