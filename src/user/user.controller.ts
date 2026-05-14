import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { CurrentUser } from "@/auth/decorator/current-user.decorator";
import { GetUserByDto } from "./docs/user.docs";
import { UpdateApiKeyDto } from "./dto/user.dto";

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '유저 데이터 불러오기 API',
    description: '로그인한 유저의 데이터를 불러옵니다.'
  })
  @ApiOkResponse({
    description: '유저 데이터 조회 성공',
    type: GetUserByDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async GetUser(@CurrentUser() user) {
    // 아바타는 https://cdn.discordapp.com/avatars/{discordId}/{avatar}.png 경로로 사용
    const { apiKey, ...result } = user;
    return result;
  }

  @ApiOperation({ summary: 'API 키 등록/변경' })
  @UseGuards(JwtAuthGuard)
  @Patch('api-key')
  async updateApiKey(@CurrentUser() user, @Body() dto: UpdateApiKeyDto) {
    await this.userService.updateApiKey(user.id, dto.apiKey);
  }
}