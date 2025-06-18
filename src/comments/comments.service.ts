import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async addComment(userId: number, documentId: number, dto: CreateCommentDto) {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { collaborators: true },
    });

    if (!doc) throw new NotFoundException('Document not found');

    const isAllowed =
      doc.ownerId === userId || doc.collaborators.some((u) => u.id === userId);

    if (!isAllowed) throw new ForbiddenException('Not authorized to comment');

    return this.prisma.comment.create({
      data: {
        message: dto.message,
        authorId: userId,
        documentId,
      },
    });
  }

  async getComments(documentId: number) {
    return this.prisma.comment.findMany({
      where: {
        documentId,
        deleted: false,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async deleteComment(userId: number, commentId: number) {
    const message = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!message) throw new NotFoundException('Comment not found');

    if (message.authorId !== userId)
      throw new ForbiddenException('Only author can delete');

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { deleted: true },
    });
  }
}
