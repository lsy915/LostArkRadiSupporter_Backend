import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateExpenditionDto {
  @ApiProperty({ example: '작고 소중한 나의 원정대', description: '원정대 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '캐릭터이름', description: '원정대 내 대표 캐릭터명 (중복 확인 및 로아 API 조회용)' })
  @IsString()
  @IsNotEmpty()
  characterName: string;
}