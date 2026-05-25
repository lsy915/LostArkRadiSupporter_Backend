import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

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

export class sendAppInvitationDto {
  @ApiProperty({ example: '디스코드 ID', description: '초대할 사용자의 디스코드 ID' })
  @IsString()
  @IsNotEmpty()
  discordId: string;

  @ApiProperty({ example: 1, description: '공격대 ID' })
  @IsNumber()
  @IsNotEmpty()
  raidId: number;
}

export class SendInviteDto {
  @ApiProperty({ example: 1, description: '공격대 ID' })
  @IsNumber()
  @IsNotEmpty()
  raidId: number;

  @ApiProperty({ example: 1, description: '초대받은 캐릭터 ID' })
  @IsNumber()
  @IsNotEmpty()
  inviteeCharacterId: number;
}

export class RespondInviteDto {
  @ApiProperty({ example: 1, description: '초대 ID' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: true, description: '초대 수락/거절' })
  @IsBoolean()
  @IsNotEmpty()
  accept: boolean;
}

export class ChangeLeaderDto {
  @ApiProperty({ example: 1, description: '공격대 ID' })
  @IsNumber()
  @IsNotEmpty()
  raidId: number;

  @ApiProperty({ example: 1, description: '캐릭터 ID' })
  @IsNumber()
  @IsNotEmpty()
  characterId: number;
}

export class RenameRaidDto {
  @ApiProperty({ example: 1, description: '공격대 ID' })
  @IsNumber()
  @IsNotEmpty()
  raidId: number;

  @ApiProperty({ example: "공대 이름 변경", description: '변경할 공격대 이름' })
  @IsString()
  @IsNotEmpty()
  raidName: string;
}

export class RaidIdDto {
  @ApiProperty({ example: 1, description: '공격대 ID' })
  @IsNumber()
  @IsNotEmpty()
  raidId: number;
}