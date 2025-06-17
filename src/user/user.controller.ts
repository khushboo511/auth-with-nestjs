import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from 'generated/prisma';
import { JwtGuard } from 'src/common/guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { getUser } from 'src/decorator/getUser-decorator';
import { Roles } from 'src/decorator/roles-decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@getUser() user: User) {
    return user;
  }

  @Patch()
  editUser() {}

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminData() {
    return 'Only accessible to admins';
  }

  @UseGuards(RolesGuard)
  @Roles('user')
  @Get('new')
  new() {
    return 'new';
  }
}
