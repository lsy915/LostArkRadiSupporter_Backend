import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Raid } from "./entity/raid.entity";
import { Repository } from "typeorm";
import { Character } from "@/expendition/entity/character.entity";
import { User } from "@/user/entity/user.entity";
import { Expendition } from "@/expendition/entity/expendition.entity";
import { createRaidDto, RespondInviteDto, sendAppInvitationDto, SendInviteDto } from "./dto/raid.dto";
import { CustomException } from "@/common/exception/custom.exception";
import { ErrorCode } from "@/common/exception/error-code";
import { RaidInvite, inviteStatus } from "./entity/raid.invite.entity";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class RaidService {
  constructor(
    @InjectRepository(Raid)
    private readonly raidRepository: Repository<Raid>,
    @InjectRepository(RaidInvite)
    private readonly raidInviteRepository: Repository<RaidInvite>,
    @InjectRepository(Expendition)
    private readonly expenditionRepository: Repository<Expendition>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
  ) {}

  async findRaidsByUserId(userId: string) {
    return this.raidRepository
    .createQueryBuilder('raid')
    .leftJoinAndSelect('raid.leader', 'leader')
    .leftJoinAndSelect('leader.expendition', 'leaderExp')
    .leftJoin('leaderExp.user', 'leaderUser')
    .addSelect(['leaderUser.username', 'leaderUser.avatar'])
    .leftJoinAndSelect('raid.members', 'member')
    .leftJoinAndSelect('member.expendition', 'memberExp')
    .leftJoin('memberExp.user', 'memberUser')
    .addSelect(['memberUser.username', 'memberUser.avatar'])
    .where('memberUser.id = :userId', { userId })
    .getMany();
  }

  //
  async createRaid(userId: string, dto: createRaidDto) {
    const character = await this.characterRepository.findOne({
      where: { id: dto.characterId },
      relations: ['expendition', 'expendition.user'],
    });
    
    if (!character) {
      throw new CustomException(ErrorCode.NOT_FOUND, '캐릭터를 찾을 수 없습니다.');
    }
    if (character.expendition.user.id !== userId) {
    throw new CustomException(ErrorCode.FORBIDDEN, '본인의 캐릭터가 아닙니다.');
    }

    const raid = this.raidRepository.create({
      name: dto.name,
      leader: character,
      members: [character],
    });

    await this.raidRepository.save(raid);

    return { message: '공격대가 생성되었습니다.', raidName: raid.name };
  }

  //
  async getGuildMembers(userId: string, guildId: string) {
  const user = await this.userRepository.findOne({
    where: { id: userId },
    select: ['discordId'],
  });

  const botToken = process.env.DISCORD_BOT_TOKEN;

  let members: any[];
  try {
    const res = await lastValueFrom(
      this.httpService.get(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
        headers: { Authorization: `Bot ${botToken}` },
      })
    );
    members = res.data;
  } catch (e) {
    throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, 'Discord API 호출에 실패했습니다.', 'INTERNAL_SERVER_ERROR');
  }

  const isUserInGuild = members.some((m: any) => m.user.id === user.discordId);
  if (!isUserInGuild) {
    throw new CustomException(ErrorCode.FORBIDDEN, '해당 서버의 멤버가 아닙니다.');
  }

  const registeredUsers = await this.userRepository.find({ select: ['discordId'] });
  const registeredIds = new Set(registeredUsers.map((u) => u.discordId));

  return members
    .filter((m: any) => !m.user.bot)
    .map((m: any) => ({
      discordId: m.user.id,
      username: m.nick ?? m.user.global_name ?? m.user.username,
      avatar: m.user.avatar,
      isRegistered: registeredIds.has(m.user.id),
    }));
  }

  //
  async getMyGuilds(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['discordAccessToken'],
    });
    if (!user?.discordAccessToken) {
      throw new CustomException(ErrorCode.NOT_FOUND, '디스코드 액세스 토큰이 없습니다. 재로그인 해주세요.');
    }

    const botToken = process.env.DISCORD_BOT_TOKEN;

    let userGuilds: any[];
    let botGuilds: any[];
    try {
      const [userRes, botRes] = await Promise.all([
        lastValueFrom(
          this.httpService.get('https://discord.com/api/v10/users/@me/guilds', {
            headers: { Authorization: `Bearer ${user.discordAccessToken}` },
          })
        ),
        lastValueFrom(
          this.httpService.get('https://discord.com/api/v10/users/@me/guilds', {
            headers: { Authorization: `Bot ${botToken}` },
          })
        ),
      ]);
      userGuilds = userRes.data;
      botGuilds = botRes.data;
    } catch (e) {
      throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, 'Discord API 호출에 실패했습니다.', 'INTERNAL_SERVER_ERROR');
    }

    const botGuildIds = new Set(botGuilds.map((g: any) => g.id));
    return userGuilds.filter((g: any) => botGuildIds.has(g.id)).map((g: any) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
    }));
  }

  //
  private async sendDiscordDM(discordId: string, content: string) {
    const headers = { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` };

    try {
      const dmChannel = await lastValueFrom(
        this.httpService.post(
          'https://discord.com/api/v10/users/@me/channels',
          { recipient_id: discordId },
          { headers }
        )
      );

      await lastValueFrom(
        this.httpService.post(
          `https://discord.com/api/v10/channels/${dmChannel.data.id}/messages`,
          { content },
          { headers }
        )
      );
    } catch (e) {
      // DM 전송 실패해도 초대 자체는 성공으로 처리
    }
  }

  //
  async sendAppInvitation(userId: string, dto: sendAppInvitationDto) {
    const inviter = await this.characterRepository.findOne({
      where: {
        raids: { id: dto.raidId },
        expendition: { user: { id: userId } },
      },
    });
    if (!inviter) {
      throw new CustomException(ErrorCode.FORBIDDEN, '공대원만 초대할 수 있습니다.');
    }

    const alreadyRegistered = await this.userRepository.findOne({
      where: { discordId: dto.discordId },
    });
    if (alreadyRegistered) {
      throw new CustomException(ErrorCode.BAD_REQUEST, '이미 회원가입한 사용자입니다.');
    }

    const raid = await this.raidRepository.findOne({
      where: { id: dto.raidId },
    });
    if (!raid) {
      throw new CustomException(ErrorCode.NOT_FOUND, '공격대를 찾을 수 없습니다.');
    }

    await this.sendDiscordDM(
      dto.discordId,
      `**[공격대 초대]** \`${inviter.characterName}\`님이 \`${raid.name}\`공격대에 초대했습니다.\n공격대에 합류하세요!\n${process.env.FRONTURL}`
    );

    return { message: '초대가 전송되었습니다.' };
  }

  //
  async getUserCharactersByDiscordId(discordId: string) {
    const targetUser = await this.userRepository.findOne({
      where: { discordId },
      select: ['id'],
    });
    if (!targetUser) {
      throw new CustomException(ErrorCode.NOT_FOUND, '가입된 사용자를 찾을 수 없습니다.');
    }

    return this.expenditionRepository.find({
      where: { user: { id: targetUser.id } },
      relations: ['characters'],
    });
  }

  //
  async sendInvite(userId: string, dto: SendInviteDto) {
    const inviter = await this.characterRepository.findOne({
      where: {
        raids: { id: dto.raidId },
        expendition: { user: { id: userId } },
      },
    });
    if (!inviter) {
      throw new CustomException(ErrorCode.FORBIDDEN, '공대원만 초대할 수 있습니다.');
    }

    const invitee = await this.characterRepository.findOne({
      where: { id: dto.inviteeCharacterId },
      relations: ['expendition', 'expendition.user'],
    });
    if (!invitee) {
      throw new CustomException(ErrorCode.NOT_FOUND, '초대할 캐릭터를 찾을 수 없습니다.');
    }

    const alreadyMember = await this.characterRepository.findOne({
      where: {
        id: dto.inviteeCharacterId,
        raids: { id: dto.raidId },
      },
    });
    if (alreadyMember) {
      throw new CustomException(ErrorCode.ALREADY_EXIST, '이미 공대원입니다.');
    }

    const alreadyInvited = await this.raidInviteRepository.findOne({
      where: {
        raid: { id: dto.raidId },
        invitee: { id: dto.inviteeCharacterId },
        status: inviteStatus.PENDING,
      },
    });
    if (alreadyInvited) {
      throw new CustomException(ErrorCode.ALREADY_EXIST, '이미 초대가 전송되었습니다.');
    }

    const invite = await this.raidInviteRepository.save(
      this.raidInviteRepository.create({
        raid: { id: dto.raidId },
        inviter,
        invitee,
      })
    );

    await this.sendDiscordDM(
      invitee.expendition.user.discordId,
      `**[공격대 초대]** \`${inviter.characterName}\`님이 공격대에 초대했습니다.\n초대 ID: \`${invite.id}\`\n수락하려면 앱에서 확인해주세요.`
    );

    return { message: '초대가 전송되었습니다.' };
  }

  //
  async respondInvite(userId: string, dto: RespondInviteDto) {
    const invite = await this.raidInviteRepository.findOne({
      where: {
        id: dto.id,
        status: inviteStatus.PENDING,
      },
      relations: ['invitee', 'invitee.expendition', 'invitee.expendition.user', 'raid', 'raid.members'],
    });
    if (!invite) {
      throw new CustomException(ErrorCode.NOT_FOUND, '초대를 찾을 수 없습니다.');
    }

    if (invite.invitee.expendition.user.id !== userId) {
      throw new CustomException(ErrorCode.FORBIDDEN, '본인에게 온 초대가 아닙니다.');
    }

    if (!dto.accept) {
      invite.status = inviteStatus.REJECTED;
      await this.raidInviteRepository.save(invite);
      return { message: '초대를 거절했습니다.' };
    }

    invite.raid.members.push(invite.invitee);
    await this.raidRepository.save(invite.raid);

    invite.status = inviteStatus.ACCEPTED;
    await this.raidInviteRepository.save(invite);

    return { message: '초대를 수락했습니다.' };
  }
}