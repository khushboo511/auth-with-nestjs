import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  //   async toggleLike(userId: number, documentId: number) {
  //     const existing = await this.prisma.like.findUnique({
  //       where: { userId_documentId: { userId, documentId } },
  //     });

  //     if (existing) {
  //       await this.prisma.like.delete({
  //         where: { userId_documentId: { userId, documentId } },
  //       });
  //       return { liked: false };
  //     }

  //     await this.prisma.like.create({
  //       data: { userId, documentId },
  //     });

  //     return { liked: true };
  //   }

  async toggleLike(userId: number, documentId: number) {
    try {
      const doc = await this.prisma.document.findUnique({
        where: { id: documentId },
      });
      if (!doc) {
        console.warn('Document does not exist');
        throw new NotFoundException('Document not found');
      }

      const existing = await this.prisma.like.findUnique({
        where: {
          userId_documentId: {
            userId,
            documentId,
          },
        },
      });

      if (existing) {
        await this.prisma.like.delete({
          where: {
            userId_documentId: {
              userId,
              documentId,
            },
          },
        });
        return { liked: false };
      }

      await this.prisma.like.create({
        data: { userId, documentId },
      });
      return { liked: true };
    } catch (err) {
      console.error('[Like Toggle Error]', err);
      throw new InternalServerErrorException(
        err.message || 'Could not toggle like',
      );
    }
  }

  async countLikes(documentId: number) {
    const count = await this.prisma.like.count({ where: { documentId } });
    return { documentId, likes: count };
  }
}
