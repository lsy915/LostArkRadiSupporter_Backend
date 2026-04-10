import { Controller, Get } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ContentsService } from "./contents.service";
import { GetChaosGateAndFieldBossResponse, GetGoldIslandResponse, InternalServerErrorAPI } from "./docs/contents.docs";

@ApiTags('Contents')
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @ApiOperation({
    summary: '골드 섬 조회 API',
    description: '골드 섬을 조회합니다.',
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: [GetGoldIslandResponse],
  })
  @ApiInternalServerErrorResponse({
    description: '연결 실패 오류',
    type: InternalServerErrorAPI,
  })
  @Get('/island')
  async GetGoldIsland() {
    return await this.contentsService.GetGoldIsland();
  }

  @ApiOperation({
    summary: '카게,필보 조회 API',
    description: '카오스게이트와 필드보스를 조회합니다.',
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: GetChaosGateAndFieldBossResponse,
  })
  @ApiInternalServerErrorResponse({
    description: '연결 실패 오류',
    type: InternalServerErrorAPI,
  })
  @Get('/content')
  async GetChaosGateAndFieldBoss() {
    return await this.contentsService.GetChaosGateAndFieldBoss();
  }
}