import { Application } from 'express';
import authRoutes from './auth.routes';
import indexRoutes from './index.routes';
import knowledgeRoutes from './knowledge.routes';
import collectionRoutes from './collection.routes';
import SearchRoutes from './search.routes';
import AnalyticsRoutes from './analytics.routes';
import SwaggerRoutes from './swagger.routes';

export default class Routes {
  constructor(app: Application) {
    app.use('/', indexRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/knowledge', knowledgeRoutes);
    app.use('/api/collections', collectionRoutes);
    app.use('/api/search', SearchRoutes);
    app.use('/api/analytics', AnalyticsRoutes);
    app.use('/docs', SwaggerRoutes);
  }
}
