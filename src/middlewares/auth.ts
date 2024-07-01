import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
export class AuthMiddleware {
  constructor() {}

  /**
   * Realiza la autorización
   */
  public auth = (req: any, res: Response, next: NextFunction) => {
    let jwtToken = req.header('Authorization');
    if (!jwtToken)
      return res
        .status(401)
        .json({ success: false, message: 'Token not found' });

    try {
      /**
       * @example
       * { id: 197, name: 'Paola', iat: 1704465971, exp: 1707057971 }
       */
      let payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_API!);
      req.user = payload;
      next();
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid token' });
    }
  };
}
