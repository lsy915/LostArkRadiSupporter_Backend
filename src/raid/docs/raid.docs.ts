import { BaseTimeDto } from "@/common/docs/base-time.docs";
import { ApiProperty } from "@nestjs/swagger";
import { GetCharacterByDtoForRaid } from "./raid.for.docs";

export class GetRaidByDto extends BaseTimeDto{
  @ApiProperty({ example: 1, description: '공격대 ID' })
  id: number;

  @ApiProperty({ example: '공격대 이름', description: '공격대 이름' })
  name: string;

  @ApiProperty({ example: 'aaaa12341234', description: '공격대 소속 디스코드 서버 ID' })
  guildId: string;

  @ApiProperty({ type: GetCharacterByDtoForRaid, description: '공대장 캐릭터 정보' })
  leader: GetCharacterByDtoForRaid;

  @ApiProperty({ type: [GetCharacterByDtoForRaid], description: '공격대 소속 유저 정보' })
  members: [GetCharacterByDtoForRaid]
}

export class GetMyGuildsByDto {
  @ApiProperty({ example: "123456789", description: '디스코드 서버 ID' })
  id: string;

  @ApiProperty({ example: "서버 이름", description: '디스코드 서버 이름' })
  name: string;

  @ApiProperty({ example: "a_123456789", description: '디스코드 서버 프로필 이미지/GIF', nullable: true })
  icon: string | null;
}

export class GetGuildMembersByDto {
  @ApiProperty({ example: "123456789", description: '디스코드 ID' })
  discordId: string;

  @ApiProperty({ example: "디스코드 프로필 이름", description: '디스코드 프로필 이름' })
  username: string;

  @ApiProperty({ example: "a1a2a3a4a5", description: '디스코드 프로필 이미지' })
  avatar: string;

  @ApiProperty({ example: true, description: '옆로아 회원가입 여부' })
  isRegistered: boolean;
}