import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { VerifiedCallback } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('facebookClientId'),
      clientSecret: configService.get('facebookClientSecret'),
      callbackURL: `${configService.get(
        'ServerPath',
      )}/api/auth/facebook/redirect`,
      profileFields: ['id', 'emails', 'name', 'photos'],
      scope: ['email'],
    });
  }

  async validate(
    _,
    __,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<void> {
    const email = profile.emails[0].value;
    const user = await this.userService.findUser({ email });
    if (user) done(null, user);
    const newUser = await this.authService.registerUserSocialNetwork(profile);
    done(null, newUser);
  }
}
