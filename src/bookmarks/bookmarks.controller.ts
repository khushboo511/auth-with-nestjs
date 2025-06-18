import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { getUser } from 'src/decorator/getUser-decorator';
import { BookmarksService } from './bookmarks.service';
import { JwtGuard } from 'src/common/guards';
import { User } from 'generated/prisma';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarkService: BookmarksService) {}

  @Post(':documentId')
  toggleBookmark(
    @Param('documentId', ParseIntPipe) docId: number,
    @getUser() userId: User,
  ) {
    return this.bookmarkService.toggleBookmark(userId.id, docId);
  }

  @Get('my')
  getMyBookmarks(@getUser() userId: User) {
    return this.bookmarkService.getBookmarksForUser(userId.id);
  }

  @Get(':documentId')
  getBookmarks(@Param('documentId', ParseIntPipe) docId: number) {
    return this.bookmarkService.countBookmarks(docId);
  }
}
