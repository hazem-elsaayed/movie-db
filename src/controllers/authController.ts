import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../utils/interfaces.js';

export class AuthController {
  constructor(private authService: IAuthService) {}

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password, username } = req.body;
      const user = await this.authService.register(email, password, username);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);
      res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  };
}
