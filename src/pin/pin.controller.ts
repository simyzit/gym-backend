import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PinService } from './pin.service';
import { CreatePinDto } from './dto/create.pin.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/guards/jwt.guard';
import { UserDocument } from 'src/user/entities/user.entity';

@Controller('pin')
export class PinController {
  constructor(private pinService: PinService) {}
  @Auth()
  @Post('/')
  async createPin(
    @CurrentUser() user: UserDocument,
    @Body() body: CreatePinDto,
  ) {
    return this.pinService.createPin(body, user);
  }

  @Auth()
  @Delete('/:id')
  async deletePin(@Param('id') id: string) {
    await this.pinService.deletePin(id);
    return { message: 'Pin deleted' };
  }
  @Auth()
  @Get('/')
  async getPin(@CurrentUser() user: UserDocument) {
    return await this.pinService.getPins(user);
  }
}
