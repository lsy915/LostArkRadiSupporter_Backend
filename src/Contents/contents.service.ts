import { CustomException } from "@/common/exception/custom.exception";
import { ErrorCode } from "@/common/exception/error-code";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { CalendarContent, GoldIslandResult } from "./type/contents.type";
import { IslandContinentData } from "./data/island.data";

@Injectable()
export class ContentsService {
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ){
    this.apiKey = this.configService.get<string>('API_KEY');
  }

  async GetGoldIsland(): Promise<GoldIslandResult[]> {
    const apiUrl = `https://developer-lostark.game.onstove.com/gamecontents/calendar`
    try {
      const response = await lastValueFrom(
        this.httpService.get<CalendarContent[]>(apiUrl, {
          headers: {
            Authorization: `bearer ${this.apiKey}`,
          },
        })
      );

      const contents = response.data;

      return contents
        .filter(content => content.CategoryName === "모험 섬")
        .filter(content =>
          content.RewardItems.some(reward =>
            reward.Items.some(item => item.Name === "골드")
          )
        )
        .map(content => {
          const goldItem = content.RewardItems
            .flatMap(reward => reward.Items)
            .find(item => item.Name === "골드");

          const now = new Date();
          const futureTimes = (goldItem?.StartTimes ?? content.StartTimes)
            .filter(time => new Date(time) > now);

          return {
            ContentsName: content.ContentsName,
            StartTimes: futureTimes,
            Continent: IslandContinentData[content.ContentsName] ?? "알 수 없음",
          };
        })
        .filter(content => content.StartTimes.length > 0);
    }
    catch(e) {
      throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "외부API에러", "INTERNAL_SERVER_ERROR");
    }
  }

  async GetChaosGateAndFieldBoss() {
    const now = new Date();
    // 오전 5시 3분(303분) 이전이면 전날로 판정
    const minutes = now.getHours() * 60 + now.getMinutes();
    if (minutes < 5 * 60 + 3) {
      now.setDate(now.getDate() - 1);
    }
    const day = now.getDay();

    if ([4, 6, 1].includes(day)) return { content: "카오스게이트" };
    if ([5, 2].includes(day)) return { content: "필드보스" };
    if (day === 0) return { content: "카오스게이트, 필드보스" };
    return { content: "없음" }; // 수요일
  }

  
}
