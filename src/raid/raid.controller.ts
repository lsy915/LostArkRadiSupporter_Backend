import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RaidService } from "./raid.service";
import { CurrentUser } from "@/auth/decorator/current-user.decorator";
import { createRaidDto, RespondInviteDto, sendAppInvitationDto, SendInviteDto } from "./dto/raid.dto";
import { GetGuildMembersByDto, GetMyGuildsByDto, GetRaidByDto } from "./docs/raid.docs";

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

  @ApiOperation({
    summary: '봇이 있는 내 디스코드 서버 목록 조회',
    description: '내가 속해 있고 봇도 있는 디스코드 서버 목록을 반환합니다.'
  })
  @ApiOkResponse({
    description: '봇이 있는 내 디스코드 서버 목록 조회 성공',
    type: GetMyGuildsByDto,
  })
  @Get('guilds')
  async getMyGuilds(@CurrentUser() user) {
    return this.raidService.getMyGuilds(user.id);
  }

  @ApiOperation({
    summary: '디스코드 서버 멤버 목록 조회',
    description: '선택한 서버의 멤버 목록과 앱 가입 여부를 반환합니다.'
  })
  @ApiOkResponse({
    description: '디스코드 서버 멤버 목록 조회 성공',
    type: GetGuildMembersByDto,
  })
  @Get('guilds/:guildId/members')
  async getGuildMembers(@CurrentUser() user, @Param('guildId') guildId: string) {
    return this.raidService.getGuildMembers(user.id, guildId);
  }

  @ApiOperation({
    summary: '가입 안 된 디스코드 유저에게 앱 가입 초대 전송',
    description: '공대원이 미가입 디스코드 유저에게 앱 가입 링크를 DM으로 전송합니다.'
  })
  @Post('app-invite')
  async sendAppInvitation(@CurrentUser() user, @Body() body: sendAppInvitationDto) {
    return this.raidService.sendAppInvitation(user.id, body);
  }

  @ApiOperation({
    summary: '디스코드 유저의 원정대 및 캐릭터 목록 조회',
    description: '가입된 디스코드 유저의 원정대와 캐릭터 목록을 반환합니다.'
  })
  @Get('user/characters')
  async getUserCharacters(@Query('discordId') discordId: string) {
    return this.raidService.getUserCharactersByDiscordId(discordId);
  }

  @ApiOperation({
    summary: '공격대 초대 전송 (외부API사용X)',
    description: '공대원이 다른 캐릭터를 공격대에 초대합니다.'
  })
  @Post('invite')
  async sendInvite(@CurrentUser() user, @Body() body: SendInviteDto) {
    return this.raidService.sendInvite(user.id, body);
  }

  @ApiOperation({
    summary: '공격대 초대 응답 (외부API사용X)',
    description: '초대를 수락하거나 거절합니다.'
  })
  @Patch('invite')
  async respondInvite(@CurrentUser() user, @Body() body: RespondInviteDto) {
    return this.raidService.respondInvite(user.id, body);
  }

  /*
  @Patch()
  async removeMember() {
    return;
  }

  @Patch()
  async renameRaid() {
    return;
  }

  async deleteRaid() {
    return;
  }
  */
}