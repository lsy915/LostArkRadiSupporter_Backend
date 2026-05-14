import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ExpenditionService } from "./expendition.service";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { CurrentUser } from "@/auth/decorator/current-user.decorator";
import { GetExpenditionByDto } from "./docs/expendition.docs";
import { CreateExpenditionDto } from "./dto/expendition.dto";

@ApiTags('Expendition')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expendition')
export class ExpenditionController {
  constructor(private readonly expenditionService: ExpenditionService) {}

  @ApiOperation({
    summary: '내 원정대 목록 조회 (캐릭터 포함)',
    description: '내 원정대 목록을 조회합니다.'
  })
  @ApiOkResponse({
    description: '내 원정대 조회 성공',
    type: GetExpenditionByDto,
  })
  @Get()
  async getMyExpenditions(@CurrentUser() user) {
    return this.expenditionService.findByUserId(user.id);
  }

  @ApiOperation({
    summary: '캐릭터이름 기반 원정대 생성 (캐릭터 포함)',
    description: '대표캐릭터 이름을 기반으로 내 원정대를 생성합니다.'
  })
  @Post()
  async createExpendition(@CurrentUser() user, @Body() body: CreateExpenditionDto) {
    return this.expenditionService.createExpendition(user.id, body);
  }
}
