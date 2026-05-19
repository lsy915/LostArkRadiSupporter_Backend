import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Raid } from "./entity/raid.entity";
import { Repository } from "typeorm";
import { Character } from "@/expendition/entity/character.entity";
import { User } from "@/user/entity/user.entity";
import { Expendition } from "@/expendition/entity/expendition.entity";
import { createRaidDto } from "./dto/raid.dto";
import { CustomException } from "@/common/exception/custom.exception";
import { ErrorCode } from "@/common/exception/error-code";

@Injectable()
export class RaidService {
  constructor(
    @InjectRepository(Raid)
    private readonly raidRepository: Repository<Raid>,
    @InjectRepository(Expendition)
    private readonly expenditionRepository: Repository<Expendition>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  async findCharacterByUserId(userId: string) {

  }

  async findExpenditionByUserId(userId: string) {
    return this.expenditionRepository.find({
      where: { user: { id: userId } },
      relations: ["characters"],
    });
  }

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
}