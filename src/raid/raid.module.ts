import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Raid } from "./entity/raid.entity";
import { User } from "@/user/entity/user.entity";
import { Expendition } from "@/expendition/entity/expendition.entity";
import { Character } from "@/expendition/entity/character.entity";
import { RaidController } from "./raid.controller";
import { RaidService } from "./raid.service";
import { RaidInvite } from "./entity/raid.invite.entity";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [TypeOrmModule.forFeature([Raid, Expendition, Character, User, RaidInvite]), HttpModule],
  controllers: [RaidController],
  providers: [RaidService],
})
export class RaidModule {}