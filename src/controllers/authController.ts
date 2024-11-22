import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';

const authService = new AuthService();

export class AuthController {
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, username } = req.body;
      const user = await authService.register(email, password, username);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  }
}
