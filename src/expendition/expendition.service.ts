import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expendition } from "./entity/expendition.entity";
import { Character } from "./entity/character.entity";
import { changeExpenditionNameDto, CreateExpenditionDto, updateCharacterDto, updateExpenditionDto } from "./dto/expendition.dto";
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

  async findAPIByUserId(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['apiKey'],
    });

    if (!user) {
      throw new CustomException(ErrorCode.NOT_FOUND, "로스트아크 API키가 등록되지 않았습니다.");
    }
    return user;
  }

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

    const user = await this.findAPIByUserId(userId);

    const expenditionAPIUrl = `https://developer-lostark.game.onstove.com/characters/${dto.characterName}/siblings`;
    let apiCharacters: any[];
    try {
      const response = await lastValueFrom(
        this.httpService.get(expenditionAPIUrl, {
          headers: { Authorization: `bearer ${user.apiKey}` },
        })
      );
      if (response.data.length === 0) {
        throw new CustomException(ErrorCode.NOT_FOUND, "API - 캐릭터를 찾을 수 없습니다.");
      }
      apiCharacters = response.data;
    } catch (e) {
      if (e instanceof CustomException) throw e;
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

  async updateExpendition(userId: string, dto: updateExpenditionDto) {
    const isExpendition = await this.expenditionRepository.findOne({
      where: { user: { id: userId }, id: dto.id },
      relations: ['characters'],
    });
    if (!isExpendition) {
      throw new CustomException(ErrorCode.NOT_FOUND, '원정대를 찾을 수 없습니다.');
    }

    const sorted = [...isExpendition.characters].sort((a, b) => {
      const levelA = parseFloat(a.characterAvgLevel.replace(/,/g, ''));
      const levelB = parseFloat(b.characterAvgLevel.replace(/,/g, ''));
      return levelB - levelA;
    });

    const user = await this.findAPIByUserId(userId);

    let apiCharacters: any[];
    try {
      const url1 = `https://developer-lostark.game.onstove.com/characters/${sorted[0].characterName}/siblings`;
      const response = await lastValueFrom(
        this.httpService.get(url1, { headers: { Authorization: `bearer ${user.apiKey}` } })
      );
      if (response.data.length > 0) {
        apiCharacters = response.data;
      } else if (sorted[1]) {
        const url2 = `https://developer-lostark.game.onstove.com/characters/${sorted[1].characterName}/siblings`;
        const response2 = await lastValueFrom(
          this.httpService.get(url2, { headers: { Authorization: `bearer ${user.apiKey}` } })
        );
        if (response2.data.length === 0) {
          throw new CustomException(ErrorCode.NOT_FOUND, "가장높은 레벨의 캐릭터와 그 다음 캐릭터를 찾지 못했습니다. 관리자에게 문의 주세요.");
        }
        apiCharacters = response2.data;
      } else {
        throw new CustomException(ErrorCode.NOT_FOUND, "캐릭터를 찾을 수 없습니다.");
      }
    } catch (e) {
      if (e instanceof CustomException) throw e;
      throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "외부API에러 또는 잘못된 API키", "INTERNAL_SERVER_ERROR");
    }

    const existingMap = new Map(isExpendition.characters.map(c => [c.characterName, c]));
    const apiMap = new Map(apiCharacters.map((c: any) => [c.CharacterName, c]));

    // DB에만 있고 API에 없는 캐릭터 삭제
    const toDelete = isExpendition.characters.filter(c => !apiMap.has(c.characterName));
    if (toDelete.length > 0) {
      await this.characterRepository.remove(toDelete);
    }

    // 양쪽에 다 있는 캐릭터 레벨/클래스 업데이트
    const toUpdate = isExpendition.characters
      .filter(c => apiMap.has(c.characterName))
      .map(c => {
        const apiChar = apiMap.get(c.characterName);
        c.characterAvgLevel = apiChar.ItemAvgLevel;
        c.characterClassName = apiChar.CharacterClassName;
        return c;
      });
    if (toUpdate.length > 0) {
      await this.characterRepository.save(toUpdate);
    }

    // API에만 있는 새 캐릭터 추가
    const toAdd = apiCharacters.filter((c: any) => !existingMap.has(c.CharacterName));
    if (toAdd.length > 0) {
      const newCharacters = toAdd.map((char: any) =>
        this.characterRepository.create({
          characterName: char.CharacterName,
          characterClassName: char.CharacterClassName,
          characterAvgLevel: char.ItemAvgLevel,
          expendition: isExpendition,
        })
      );
      await this.characterRepository.save(newCharacters);
    }

    return this.expenditionRepository.findOne({
      where: { id: isExpendition.id },
      relations: ['characters'],
    });
  }

  async changeExpenditionName(userId: string, dto: changeExpenditionNameDto) {
    const expendition = await this.expenditionRepository.findOne({
      where: { user: { id: userId }, id: dto.id },
    });

    if (!expendition) {
      throw new CustomException(ErrorCode.NOT_FOUND, '원정대를 찾을 수 없습니다.');
    }

    expendition.name = dto.name;
    return this.expenditionRepository.save(expendition);
  }

  async updateCharacter(userId: string, dto: updateCharacterDto) {
    const isCharacter = await this.characterRepository.findOne({
      where: { expendition: { id: dto.id }, characterName: dto.characterName },
    });
    if (!isCharacter) {
      throw new CustomException(ErrorCode.NOT_FOUND, 'DB - 캐릭터를 찾을 수 없습니다.');
    }

    const user = await this.findAPIByUserId(userId);

    let apiCharacter: any;
    try{
      const characterAPIUrl = `https://developer-lostark.game.onstove.com/armories/characters/${isCharacter.characterName}/profiles`;
      const response = await lastValueFrom(
        this.httpService.get(characterAPIUrl, { headers: { Authorization: `bearer ${user.apiKey}`} })
      );
      if (!response.data) {
        throw new CustomException(ErrorCode.NOT_FOUND, "API - 캐릭터를 찾을 수 없습니다.");
      }
      apiCharacter = response.data;
    } catch (e) {
      if (e instanceof CustomException) throw e;
      throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "외부API에러 또는 잘못된 API키", "INTERNAL_SERVER_ERROR");
    }

    isCharacter.characterAvgLevel = apiCharacter.ItemAvgLevel;
    isCharacter.characterClassName = apiCharacter.CharacterClassName;
    isCharacter.combatPower = apiCharacter.CombatPower ?? null;
    isCharacter.characterImage = apiCharacter.CharacterImage ?? null;
    isCharacter.guildName = apiCharacter.GuildName ?? null;
    return this.characterRepository.save(isCharacter);
  }

  async deleteExpendition(userId: string, dto: updateExpenditionDto) {
    const expendition = await this.expenditionRepository.findOne({
      where: { user: { id: userId }, id: dto.id },
    });

    if (!expendition) {
      throw new CustomException(ErrorCode.NOT_FOUND, '원정대를 찾을 수 없거나 소유하지 않은 원정대입니다.');
    }

    return this.expenditionRepository.delete(expendition);
  }
}
