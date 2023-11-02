import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

@Injectable()
export class validationIdMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction): void {
    const validId = ObjectId.isValid(req.params.id);
    if (!validId) throw new BadRequestException('invalid Id');
    next();
  }
}
