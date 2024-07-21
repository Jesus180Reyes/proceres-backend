import bcrypt from 'bcrypt';

export class PasswordUtilities {
  async hashPassword(password: string | undefined): Promise<object> {
    const salt = bcrypt.genSaltSync(10);
    const randomPassword = Math.random().toString(36).slice(-8);

    return {
      hashpass: bcrypt.hashSync(password ?? randomPassword, salt),
      randomPassword,
    };
  }
}
