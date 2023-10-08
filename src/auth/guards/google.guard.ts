import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const AuthGoogle = () => UseGuards(AuthGuard('google'));
