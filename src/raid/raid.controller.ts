import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RaidService } from "./raid.service";
import { CurrentUser } from "@/auth/decorator/current-user.decorator";
import { createRaidDto } from "./dto/raid.dto";
import { GetRaidByDto } from "./docs/raid.docs";

@ApiTags('Raid')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('raid')
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

  @ApiOperation({
    summary: '내가 속한 공격대 목록 조회 (외부API사용X)',
    description: '내가 속한 공격대 목록을 조회합니다.'
  })
  @ApiOkResponse({
    description: '내가 속한 공격대 조회 성공',
    type: GetRaidByDto,
  })
  @Get()
  async GetRaids(@CurrentUser() user) {
    return this.raidService.findRaidsByUserId(user.id);
  }

  @ApiOperation({
    summary: '공격대 생성 (외부API사용X)',
    description: '공격대를 생성합니다.'
  })
  @Post('create')
  async createRaid(@CurrentUser() user, @Body() body: createRaidDto) {
    return this.raidService.createRaid(user.id, body);
  }
}