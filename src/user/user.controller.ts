import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from 'generated/prisma';
import { JwtGuard } from 'src/auth/guards';
import { getUser } from 'src/decorator/getUser-decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@getUser() user: User) {
    return user;
  }

  @Patch()
  editUser() {}
}
