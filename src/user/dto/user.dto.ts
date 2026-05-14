import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateApiKeyDto {
  @ApiProperty({ example: 'aaAaaaAaa...', description: '로스트아크 API 키' })
  @IsString()
  apiKey: string;
}