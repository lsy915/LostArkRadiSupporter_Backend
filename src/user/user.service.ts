import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { CustomException } from "@/common/exception/custom.exception";
import { ErrorCode } from "@/common/exception/error-code";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
  ) {}

  async updateApiKey(userId: string, apiKey: string) {
    await this.userRepository.update(userId, { apiKey });
  }

  async validateApiKey(userId: string) {
    const user = await this.userRepository.findOne({
      select: ['apiKey'],
      where: { id: userId },
    });

    if (!user?.apiKey) {
      throw new CustomException(ErrorCode.NOT_FOUND, 'API 키가 등록되지 않았습니다.');
    }

    try {
      await lastValueFrom(
        this.httpService.get('https://developer-lostark.game.onstove.com/news/notices?type=%EC%83%81%EC%A0%90', {
          headers: { Authorization: `bearer ${user.apiKey}` },
        })
      );
      return { valid: true };
    } catch (e) {
      return { valid: false };
    }
  }
}