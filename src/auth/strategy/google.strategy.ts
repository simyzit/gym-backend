import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { VerifiedCallback } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('googleClientId'),
      clientSecret: configService.get('googleClientSecret'),
      callbackURL: configService.get('googleCallbackURL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(_, __, profile: Profile, done: VerifiedCallback) {
    const email = profile.emails[0].value;
    const user = await this.userService.findUserByEmail(email);
    if (user) done(null, user);
    const newUser = await this.userService.addUserSocialNetwork(profile);
    done(null, newUser);
  }
}
