import jwt, { SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env.config';

const privateKey = fs.readFileSync(
  path.join(__dirname, '../config/keys/private.pem'),
  'utf8'
);
const publicKey = fs.readFileSync(
  path.join(__dirname, '../config/keys/public.pem'),
  'utf8'
);

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
    return jwt.sign(payload, privateKey, options);
  }

  static verifyToken(token: string): CustomJwtPayload {
    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    }) as CustomJwtPayload;
  }
}
