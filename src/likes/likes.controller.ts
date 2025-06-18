import {
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { getUser } from 'src/decorator/getUser-decorator';
import { User } from 'generated/prisma';
import { JwtGuard } from 'src/common/guards';

@UseGuards(JwtGuard)
@Controller('likes')
export class LikesController {
  private readonly logger = new Logger(LikesController.name);
  constructor(private likeService: LikesService) {}

  @Post(':documentId')
  toggleLike(
    @Param('documentId', ParseIntPipe) docId: number,
    @getUser() user: User,
  ) {
    return this.likeService.toggleLike(user.id, docId);
  }

  @Get(':documentId')
  getLikes(@Param('documentId', ParseIntPipe) docId: number) {
    return this.likeService.countLikes(docId);
  }
}
