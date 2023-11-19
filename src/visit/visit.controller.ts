import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { VisitService } from './visit.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { VisitDocument } from './entities/visit.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserDocument } from 'src/user/entities/user.entity';
import { Response } from 'express';

@Controller('visit')
export class VisitController {
  constructor(private visitService: VisitService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getVisits(@CurrentUser() user: UserDocument): Promise<VisitDocument[]> {
    return await this.visitService.getVisits(user);
  }

  @Get('/:id')
  async createVisit(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<void> {
    const data = await this.visitService.createVisit(id);
    if (data) res.redirect(`${process.env.FRONTEND_DOMAIN_PROD}/success-visit`);
    res.redirect(`${process.env.FRONTEND_DOMAIN_PROD}/unsuccess-visit`);
  }
}
