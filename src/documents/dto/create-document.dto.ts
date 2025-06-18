// src/documents/dto/create-document.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  status?: 'DRAFT' | 'PUBLISHED';
}
