import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpenditionController } from "./expendition.controller";
import { ExpenditionService } from "./expendition.service";
import { Expendition } from "./entity/expendition.entity";
import { Character } from "./entity/character.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Expendition, Character])],
  controllers: [ExpenditionController],
  providers: [ExpenditionService],
})
export class ExpenditionModule {}