// src/documents/documents.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto, ShareDocumentDto } from './dto';
import { JwtGuard } from 'src/common/guards';

@UseGuards(JwtGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(req.user.id, dto);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.documentsService.delete(req.user.id, id);
  }

  @Post(':id/share')
  share(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ShareDocumentDto,
  ) {
    return this.documentsService.share(req.user.id, id, dto);
  }
}
