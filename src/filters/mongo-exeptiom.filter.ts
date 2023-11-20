import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import * as mongoose from 'mongoose';

@Catch(mongoose.mongo.MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: MongoServerError, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response.status(409).json({
          message: 'User with this email already register',
        });
    }
  }
}

//
