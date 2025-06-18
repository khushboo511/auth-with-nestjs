// src/documents/dto/share-document.dto.ts
import { IsArray, IsInt } from 'class-validator';

export class ShareDocumentDto {
  @IsArray()
  @IsInt({ each: true })
  userIds: number[]; // list of collaborators
}
