import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { VisitService } from './visit.service';
import { Message } from 'src/auth/types/interfaces/message';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { VisitDocument } from './entities/visit.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserDocument } from 'src/user/entities/user.entity';

@Controller('visit')
export class VisitController {
  constructor(private visitService: VisitService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getVisits(@CurrentUser() user: UserDocument): Promise<VisitDocument[]> {
    return await this.visitService.getVisits(user);
  }

  @Get('/:id')
  async createVisit(@Param('id') id: string): Promise<Message> {
    await this.visitService.createVisit(id);
    return { message: 'The visit was successful' };
  }
}
