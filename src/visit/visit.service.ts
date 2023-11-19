import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VisitDocument } from './entities/visit.entity';
import { validateIdMongo } from 'src/helpers/validateIdMongo';
import { UserService } from 'src/user/user.service';
import { filterByRole } from 'src/helpers/filterByRole';
import { UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class VisitService {
  constructor(
    @InjectModel('Visit') private visitModel: Model<VisitDocument>,
    private userService: UserService,
  ) {}

  async createVisit(id: string): Promise<boolean> {
    if (!validateIdMongo(id)) {
      throw new BadRequestException('invalid Id');
    }
    const findUserById = await this.userService.findUserById(id);
    if (!findUserById) throw new NotFoundException();
    if (findUserById.days === 0) {
      return false;
    }

    await this.visitModel.create({ userId: findUserById._id });
    await this.userService.decrementDays(findUserById._id);
    return true;
  }

  async getVisits(user: UserDocument): Promise<VisitDocument[]> {
    return this.visitModel.aggregate([
      {
        $match: filterByRole(user),
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          _id: 1,
          userName: {
            $ifNull: [{ $arrayElemAt: ['$user.name', 0] }, 'deleted'],
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }
}
