import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VisitDocument } from './entities/visit.entity';
import { validateIdMongo } from 'src/helpers/validateIdMongo';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VisitService {
  constructor(
    @InjectModel('Visit') private visitModel: Model<VisitDocument>,
    private userService: UserService,
  ) {}

  async createVisit(id: string): Promise<void> {
    if (!validateIdMongo(id)) {
      throw new BadRequestException('invalid Id');
    }
    const findUserById = await this.userService.findUserById(id);
    if (!findUserById) throw new NotFoundException();
    if (findUserById.days === 0) {
      throw new ForbiddenException('You have run out of visits');
    }

    await this.visitModel.create({ userId: findUserById._id });
    await this.userService.decrementDays(findUserById._id);
  }
}
