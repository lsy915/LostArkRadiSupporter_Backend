import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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

export class updateExpenditionDto {
  @ApiProperty({ example: 1, description: '원정대 ID' })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class changeExpenditionNameDto {
  @ApiProperty({ example: 1, description: '원정대 ID' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: '원정대 이름', description: '변경할 원정대 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class updateCharacterDto {
  @ApiProperty({ example: 1, description: '원정대 ID' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: '캐릭터이름', description: '갱신 할 캐릭터명' })
  @IsString()
  @IsNotEmpty()
  characterName: string;
}