import { ApiProperty } from "@nestjs/swagger";

export class GetUserByDtoForRaid {
  @ApiProperty({ example: '유저이름', description: '유저 이름' })
  username: string;
  
  @ApiProperty({ example: 'aaaa12341234', description: '유저 디스코드 프로필 이미지 코드' })
  avatar: string;
}

export class GetExpenditionByDtoForRaid {
  @ApiProperty({ example: 1, description: '원정대 ID' })
  id: number;

  @ApiProperty({ example: '원정대이름', description: '원정대 이름' })
  name: string;

  @ApiProperty({ type: GetUserByDtoForRaid, description: '유저 정보'})
  user: GetUserByDtoForRaid;
}

export class GetCharacterByDtoForRaid {
  @ApiProperty({ example: 1, description: '캐릭터 ID' })
  id: number;

  @ApiProperty({ example: '캐릭터이름', description: '캐릭터 이름' })
  characterName: string;

  @ApiProperty({ example: '기공사', description: '캐릭터 직업' })
  characterClassName: string;

  @ApiProperty({ example: '1800.00', description: '캐릭터 레벨' })
  characterAvgLevel: string;

  @ApiProperty({ example: '5000.00', description: '캐릭터 전투력' })
  combatPower: string;

  @ApiProperty({
    example: 'https://img.lostark.co.kr/armory/4/7DE6E8B9A7FF7EFDE8E74C7B73846C671ACBD96876473D911C7DBF4F4197E1FF.jpg?v=20260505094729',
    description: '사용자 캐릭터 이미지 링크'
  })
  characterImage: string;

  @ApiProperty({ example: '길드이름', description: '캐릭터 소속 길드 이름' })
  guildName: string;

  @ApiProperty({ type: GetExpenditionByDtoForRaid, description: '원정대 정보'})
  expendition: GetExpenditionByDtoForRaid;
}