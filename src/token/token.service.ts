import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/token/types/interfaces/tokens';
import { UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validToken(
    token: string,
    secret: string,
  ): Promise<{ id: string } | null> {
    try {
      const result = await this.jwtService.verifyAsync(token, {
        secret,
      });

      return result;
    } catch (error) {
      return null;
    }
  }

  async generateTokens(id: Pick<UserDocument, '_id'>): Promise<Token> {
    const accessToken = await this.jwtService.signAsync({ id });
    const refreshToken = await this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.get('refreshSecretKey'),
        expiresIn: this.configService.get('refreshTokenExpires'),
      },
    );
    return { accessToken, refreshToken };
  }
}
