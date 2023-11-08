import { UserDocument } from 'src/user/entities/user.entity';
import { Role } from 'src/user/types/enum/role';

export const filterByRole = (user: UserDocument) =>
  user.role === Role.USER ? { userId: user._id } : {};
