import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@/user/entity/user.entity";
import { JwtPayload } from "./payload/jwt.payload";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async discordLogin(profile: any, discordAccessToken: string): Promise<{ accessToken: string }> {
    const { id, username, avatar, email } = profile;

    let user = await this.userRepository.findOne({ where: { discordId: id } });

    if (!user) {
      user = this.userRepository.create({ discordId: id, username, avatar, email, discordAccessToken });
      await this.userRepository.save(user);
    } else {
      await this.userRepository.update(user.id, { username, avatar, email, discordAccessToken });
    }

    return this.issueToken(user);
  }

  private issueToken(user: User): { accessToken: string } {
    const payload: JwtPayload = { sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
