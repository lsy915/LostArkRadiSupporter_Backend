import { JwtAuthGuard } from "@/auth/guard/jwt-auth.guard";
import { Controller, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RaidService } from "./raid.service";

@ApiTags('Raid')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('raid')
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

}