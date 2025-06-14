import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from 'generated/prisma';
import { JwtGuard } from 'src/auth/guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
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
}
