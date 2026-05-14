import { ApiProperty } from "@nestjs/swagger";

export class GetGoldIslandResponse {
  @ApiProperty({ example: '스노우팡 아일랜드', description: '골드 보상이 있는 모험 섬 이름' })
  ContentsName: string;

  @ApiProperty({
    example: ['2026-04-11T19:00:00', '2026-04-11T21:00:00', '2026-04-11T23:00:00'],
    description: '골드 보상 시간 목록',
    type: [String],
  })
  StartTimes: string[];

  @ApiProperty({ example: '슈샤이어', description: '가까운 대륙' })
  Continent: string;

  @ApiProperty({
    example: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/island_icon/island_icon_98.png',
    description: '섬 이미지 링크'
  })
  IslandIMG: string;
}

export class GetChaosGateAndFieldBossResponse {
  @ApiProperty({ example: '카오스게이트', description: '카오스게이트/필드보스/일/수 (요일)' })
  content: string;
}

export class InternalServerErrorAPI {
  @ApiProperty({
    type: 'number', title: '실패 응답 값', description: '오류 코드', example: 500,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string', title: '실패 응답 값', description: '오류 메세지',
    example: '예기치 못한 오류가 발생했습니다. 다시 한번 실행해 주십시오.',
  })
  message: string;

  @ApiProperty({
    type: 'string', title: '실패 응답 값', description: 'InternalServerError', example: 'InternalServerError'
  })
  error: string;
}
