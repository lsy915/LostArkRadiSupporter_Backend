import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ExpenditionService } from "./expendition.service";
import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { CurrentUser } from "@/auth/decorator/current-user.decorator";
import { GetExpenditionByDto } from "./docs/expendition.docs";
import { changeExpenditionNameDto, CreateExpenditionDto, updateCharacterDto, updateExpenditionDto } from "./dto/expendition.dto";

@ApiTags('Expendition')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expendition')
export class ExpenditionController {
  constructor(private readonly expenditionService: ExpenditionService) {}

  @ApiOperation({
    summary: '내 원정대 목록 조회 (외부API사용X / 캐릭터 포함)',
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
    summary: '캐릭터이름 기반 원정대 생성 (외부API사용O / 캐릭터 포함)',
    description: '대표캐릭터 이름을 기반으로 내 원정대를 생성합니다.'
  })
  @Post()
  async createExpendition(@CurrentUser() user, @Body() body: CreateExpenditionDto) {
    return this.expenditionService.createExpendition(user.id, body);
  }

  @ApiOperation({
    summary: '원정대 업데이트 (외부API사용O / 캐릭터 동기화)',
    description: '로아 API 기준으로 캐릭터 목록을 동기화합니다.'
  })
  @Patch('expendition')
  async updateExpendition(@CurrentUser() user, @Body() body: updateExpenditionDto) {
    return this.expenditionService.updateExpendition(user.id, body);
  }

  @ApiOperation({
    summary: '사용자 원정대 이름 변경 (외부API사용X)',
    description: '사용자의 원정대 이름을 변경합니다.'
  })
  @Patch('name')
  async changeExpenditionName(@CurrentUser() user, @Body() body: changeExpenditionNameDto) {
    return this.expenditionService.changeExpenditionName(user.id, body);
  }

  @ApiOperation({
    summary: '캐릭터 업데이트 (외부API사용O)',
    description: '로아 API 기준으로 특정 캐릭터 1개를 동기화합니다.'
  })
  @Patch('character')
  async updateCharacter(@CurrentUser() user, @Body() body: updateCharacterDto) {
    return this.expenditionService.updateCharacter(user.id, body);
  }
}
