import { BaseTimeDto } from "@/common/docs/base-time.docs";
import { ApiProperty } from "@nestjs/swagger";
import { GetCharacterByDto } from "./character.docs";

export class GetExpenditionByDto {
  @ApiProperty({ example: 1, description: '원정대 ID' })
  id: number;

  @ApiProperty({ example: '작고소중한나의원정대', description: '사용자가 저장한 원정대이름' })
  name: string;

  @ApiProperty({
    type: () => GetCharacterByDto,
    isArray: true,
    description: '캐릭터항목리스트 없으면 항목X',
  })
  characters: GetCharacterByDto[] | null;
}