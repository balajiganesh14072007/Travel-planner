import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db';

import authRoutes from './server/routes/authRoutes';
import tripRoutes from './server/routes/tripRoutes';
import activityRoutes from './server/routes/activityRoutes';
import expenseRoutes from './server/routes/expenseRoutes';
import travelRoutes from './server/routes/travelRoutes';
import adminRoutes from './server/routes/adminRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect Database (MongoDB Atlas or persistent fallback)
  await connectDB();

  // API Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'TravelMate API',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // REST API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/trips', tripRoutes);
  app.use('/api/activities', activityRoutes);
  app.use('/api/expenses', expenseRoutes);
  app.use('/api/travel', travelRoutes);
  app.use('/api/admin', adminRoutes);

  // Serve static assets or mount Vite dev middleware
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite dev server middleware mounted.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  // Centralized API 404 handler for unmatched /api routes
  app.all('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'API route not found' });
  });

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TravelMate server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal failure starting server:', err);
  process.exit(1);
});
