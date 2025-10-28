export interface TokenPayload {
  id: string;
  rol: string;
  verify: boolean;
  iat: number;
  exp: number;
}
