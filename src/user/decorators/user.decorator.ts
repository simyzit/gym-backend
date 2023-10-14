import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: keyof UserDocument, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user[data] : user;
  },
);
