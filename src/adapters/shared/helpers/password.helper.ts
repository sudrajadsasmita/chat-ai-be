import * as bcrypt from 'bcryptjs';

export class PasswordHelper {
  static async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  static async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
