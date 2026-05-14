import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ExpenditionService } from "./expendition.service";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { CurrentUser } from "@/auth/decorator/current-user.decorator";

@ApiTags('Expendition')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expendition')
export class ExpenditionController {
  constructor(private readonly expenditionService: ExpenditionService) {}

  @ApiOperation({ summary: '내 원정대 목록 조회 (캐릭터 포함)' })
  @Get()
  async getMyExpenditions(@CurrentUser() user) {
    return this.expenditionService.findByUserId(user.id);
  }
}
