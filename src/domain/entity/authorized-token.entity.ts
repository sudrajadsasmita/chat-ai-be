export class AuthorizedUser {
  exp?: number;
  iat?: number;
  sub?: string;
  name!: string;
  email!: string;
}
