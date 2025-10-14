import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

export default class AuthController {
  public index(_req: Request, res: Response): void {
    res.send('Auth route');
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    const credentials = req.body;

    if (!credentials) {
      res.status(400).json({ message: 'Invalid login payload', user: null });
    }

    try {
      const authService = new AuthService();
      const { user, message, status, token } = await authService.login(credentials);

      res.status(status).json({ message, user, token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  public register = async (req: Request, res: Response): Promise<void> => {
    const user = req.body;

    if (!user) {
      res.status(400).json({ message: 'Invalid registration payload', user: null });
    }

    try {
      const authService = new AuthService();
      const { message, user: newUser, status } = await authService.register(user);

      res.status(status).json({ message, user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
}
