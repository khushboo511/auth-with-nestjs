import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/common/guards';
import { CreateCommentDto } from './dto/comment.dto';
import { CommentsService } from './comments.service';

@UseGuards(JwtGuard)
@Controller('documents/:documentId/comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Post()
  addComment(
    @Request() req,
    @Param('documentId', ParseIntPipe) documentId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.addComment(req.user.id, documentId, dto);
  }

  @Get()
  getComments(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.commentService.getComments(documentId);
  }

  @Delete(':commentId')
  deleteComment(
    @Request() req,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.deleteComment(req.user.id, commentId);
  }
}
