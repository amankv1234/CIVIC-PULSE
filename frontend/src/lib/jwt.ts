import jwt from 'jsonwebtoken';
import { UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'civicpulse_production_jwt_super_secret_key_2026_smart_city_jaipur';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  departmentId?: string;
  ministryId?: string;
  zoneId?: string;
  isVerified?: boolean;
  digiLockerVerified?: boolean;
}

export function signJwt(payload: TokenPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyJwt(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
