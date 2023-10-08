import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const AuthFacebook = () => UseGuards(AuthGuard('facebook'));
