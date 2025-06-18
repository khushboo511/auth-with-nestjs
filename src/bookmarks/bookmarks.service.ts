import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async toggleBookmark(userId: number, documentId: number) {
    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_documentId: { userId, documentId } },
    });

    if (existing) {
      await this.prisma.bookmark.delete({
        where: { userId_documentId: { userId, documentId } },
      });
      return { bookmarked: false };
    }

    await this.prisma.bookmark.create({
      data: { userId, documentId },
    });

    return { bookmarked: true };
  }

  async getBookmarksForUser(userId: number) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      include: { document: true },
    });
  }

  async countBookmarks(documentId: number) {
    const count = await this.prisma.bookmark.count({ where: { documentId } });
    return { documentId, bookmarks: count };
  }
}
