import bcrypt from 'bcryptjs';
import { HashAdapter } from '../interfaces/hash.interface';

export class BcryptAdapter implements HashAdapter {
  private readonly saltRounds: number = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
