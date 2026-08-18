import { UserRole } from '../enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface JwtPayloadWithUser extends JwtPayload {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}