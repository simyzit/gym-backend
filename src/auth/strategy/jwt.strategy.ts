import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { User, UserDocument } from 'src/user/entities/user.entity';

import { Injectable, UnauthorizedException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,

    private readonly UserService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('accessSecretKey'),
    });
  }

  async validate({ id }: Pick<UserDocument, 'id'>): Promise<User> {
    const findUser = await this.UserService.findUserById(id);
    if (!findUser.accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    return findUser;
  }
}
