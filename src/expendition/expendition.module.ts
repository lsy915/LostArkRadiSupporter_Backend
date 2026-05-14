import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { ExpenditionController } from "./expendition.controller";
import { ExpenditionService } from "./expendition.service";
import { Expendition } from "./entity/expendition.entity";
import { Character } from "./entity/character.entity";
import { User } from "@/user/entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Expendition, Character, User]), HttpModule],
  controllers: [ExpenditionController],
  providers: [ExpenditionService],
})
export class ExpenditionModule {}