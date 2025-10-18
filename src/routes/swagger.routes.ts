import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../swagger';

class SwaggerRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.use('/', swaggerUi.serve);
    this.router.get('/', swaggerUi.setup(swaggerDocument));
  }
}

export default new SwaggerRoutes().router;
