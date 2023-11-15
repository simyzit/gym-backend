import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { VerifiedCallback } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('googleClientId'),
      clientSecret: configService.get('googleClientSecret'),
      callbackURL: `${configService.get('ServerPath')}api/auth/google/redirect`,
      scope: ['profile', 'email'],
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
