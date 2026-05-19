import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class createRaidDto {
  @ApiProperty({ example: '1750레이드', description: '공격대 이름' })
  @IsNumber()
  @IsNotEmpty()
  characterId: number;

  @ApiProperty({ example: '1750레이드', description: '공격대 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;
}