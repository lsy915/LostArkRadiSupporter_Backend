import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { CurrentUser } from "./decorator/current-user.decorator";
import { User } from "@/user/entity/user.entity";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @ApiOperation({ summary: "Discord 로그인 시작" })
  @Get("discord")
  @UseGuards(AuthGuard("discord"))
  discordAuth() {}

  @ApiOperation({ summary: "Discord 로그인 콜백" })
  @Get("discord/callback")
  @UseGuards(AuthGuard("discord"))
  discordCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = req.user as { accessToken: string };
    const frontUrl = this.configService.get<string>("FRONTURL");
    return res.redirect(`${frontUrl}?token=${accessToken}`);
  }
}
