import { Controller, Param, Post } from '@nestjs/common';
import { VisitService } from './visit.service';
import { Message } from 'src/auth/types/interfaces/message';

@Controller('visit')
export class VisitController {
  constructor(private visitService: VisitService) {}

  @Post('/:id')
  async createVisit(@Param('id') id: string): Promise<Message> {
    await this.visitService.createVisit(id);
    return { message: 'The visit was successful' };
  }
}
