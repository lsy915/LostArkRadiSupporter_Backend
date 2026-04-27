import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-discord";
import { AuthService } from "../auth.service";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, "discord") {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>("DISCORD_CLIENT_ID"),
      clientSecret: configService.get<string>("DISCORD_CLIENT_SECRET"),
      callbackURL: configService.get<string>("DISCORD_CALLBACK_URL"),
      scope: ["identify", "email"],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    return this.authService.discordLogin(profile);
  }
}
