import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expendition } from "./entity/expendition.entity";

@Injectable()
export class ExpenditionService {
  constructor(
    @InjectRepository(Expendition)
    private readonly expenditionRepository: Repository<Expendition>,
  ) {}

  findByUserId(userId: string) {
    const expendition = this.expenditionRepository.find({
      where: { user: { id: userId } },
      relations: ["characters"],
    });
    return expendition;
  }
}
