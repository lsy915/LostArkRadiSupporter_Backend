import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "@/user/entity/user.entity";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { JwtPayload } from "./payload/jwt.payload";
import { CustomException } from "@/common/exception/custom.exception";
import { ErrorCode } from "@/common/exception/error-code";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } });
    if (exists) throw new CustomException(ErrorCode.ALREADY_EXIST, "이미 사용 중인 이메일입니다.");

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password: hashed });
    await this.userRepository.save(user);

    return this.issueToken(user);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new CustomException(ErrorCode.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new CustomException(ErrorCode.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");

    return this.issueToken(user);
  }

  private issueToken(user: User): { accessToken: string } {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
