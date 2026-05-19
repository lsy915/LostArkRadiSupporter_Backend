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