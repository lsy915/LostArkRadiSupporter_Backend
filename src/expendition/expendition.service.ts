import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expendition } from "./entity/expendition.entity";
import { Character } from "./entity/character.entity";
import { CreateExpenditionDto } from "./dto/expendition.dto";
import { CustomException } from "@/common/exception/custom.exception";
import { ErrorCode } from "@/common/exception/error-code";
import { lastValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { User } from "@/user/entity/user.entity";

@Injectable()
export class ExpenditionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Expendition)
    private readonly expenditionRepository: Repository<Expendition>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    private readonly httpService: HttpService,
  ) {}

  async findByUserId(userId: string) {
    return this.expenditionRepository.find({
      where: { user: { id: userId } },
      relations: ["characters"],
    });
  }

  async createExpendition(userId: string, dto: CreateExpenditionDto) {
    const duplicate = await this.characterRepository.findOne({
      where: {
        characterName: dto.characterName,
        expendition: { user: { id: userId } },
      },
      relations: ["expendition", "expendition.user"],
    });

    if (duplicate) {
      throw new CustomException(ErrorCode.ALREADY_EXIST, "이미 등록된 원정대/캐릭터입니다.");
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['apiKey'],
    });

    const expenditionAPIUrl = `https://developer-lostark.game.onstove.com/characters/${dto.characterName}/siblings`;
    let apiCharacters: any[];
    try {
      const response = await lastValueFrom(
        this.httpService.get(expenditionAPIUrl, {
          headers: { Authorization: `bearer ${user.apiKey}` },
        })
      );
      apiCharacters = response.data;
    } catch (e) {
      throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "외부API에러 또는 잘못된 API키", "INTERNAL_SERVER_ERROR");
    }

    const expendition = await this.expenditionRepository.save(
      this.expenditionRepository.create({
        name: dto.name,
        user: { id: userId },
      })
    );

    const characters = await Promise.all(
      apiCharacters.map(async (char) => {
        const characterAPIUrl = `https://developer-lostark.game.onstove.com/armories/characters/${char.CharacterName}/profiles`;
        let profile: any = {};
        try {
          const res = await lastValueFrom(
            this.httpService.get(characterAPIUrl, {
              headers: { Authorization: `bearer ${user.apiKey}` },
            })
          );
          profile = res.data;
        } catch (e) {
          throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "외부API에러 또는 잘못된 API키", "INTERNAL_SERVER_ERROR");
        } 

        return this.characterRepository.create({
          characterName: profile.CharacterName,
          characterClassName: profile.CharacterClassName,
          characterAvgLevel: profile.ItemAvgLevel,
          combatPower: profile.CombatPower ?? null,
          characterImage: profile.CharacterImage ?? null,
          guildName: profile.GuildName ?? null,
          expendition,
        });
      })
    );
    await this.characterRepository.save(characters);

    return expendition;
  }
}
