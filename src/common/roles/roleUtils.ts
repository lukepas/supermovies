import { User } from '../../user/user.entity';
import { Role } from '../../role/role.enum';

export const isInRole = (user: User, role: Role) => {
  return user.role === role;
};
