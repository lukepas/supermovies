import { Role } from '../role/role.enum';

export class UserTokenModel {
  token: string;
  role: Role;

  constructor(token: string, role: Role) {
    this.token = token;
    this.role = role;
  }
}
