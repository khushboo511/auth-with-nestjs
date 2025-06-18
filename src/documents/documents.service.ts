// src/documents/documents.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto, ShareDocumentDto } from './dto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateDocumentDto) {
    return this.prisma.document.create({
      data: {
        ...dto,
        ownerId: userId,
      },
    });
  }

  async findOne(userId: number, documentId: number) {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { collaborators: true },
    });

    if (!doc) throw new NotFoundException('Document not found');

    const isOwner = doc.ownerId === userId;
    const isCollaborator = doc.collaborators.some((u) => u.id === userId);

    if (!isOwner && !isCollaborator)
      throw new ForbiddenException('Access denied');

    return doc;
  }

  async update(userId: number, documentId: number, dto: UpdateDocumentDto) {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc || doc.ownerId !== userId)
      throw new ForbiddenException('Only owner can update');

    return this.prisma.document.update({
      where: { id: documentId },
      data: dto,
    });
  }

  async delete(userId: number, documentId: number) {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc || doc.ownerId !== userId)
      throw new ForbiddenException('Only owner can delete');

    return this.prisma.document.delete({
      where: { id: documentId },
    });
  }

  async share(userId: number, documentId: number, dto: ShareDocumentDto) {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc || doc.ownerId !== userId)
      throw new ForbiddenException('Only owner can share');

    return this.prisma.document.update({
      where: { id: documentId },
      data: {
        collaborators: {
          set: dto.userIds.map((id: any) => ({ id })),
        },
      },
      include: { collaborators: true },
    });
  }
}
