import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.config';

interface CustomJwtPayload {
  userId: string;
  email: string;
}

export class TokenUtil {
  static generateToken(userId: string, email: string): string {
    const payload: CustomJwtPayload = { userId, email };
    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign(payload, config.privateKey, options);
  }

  static verifyToken(token: string): CustomJwtPayload {
    return jwt.verify(token, config.publicKey, {
      algorithms: ['RS256'],
    }) as CustomJwtPayload;
  }
}
