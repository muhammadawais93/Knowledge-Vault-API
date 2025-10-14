import { Request, Response } from 'express';

export default class IndexController {
  public getHealthStatus = (req: Request, res: Response): void => {
    res.json({ message: 'API is running smoothly' });
  };
}
