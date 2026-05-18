import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Raid } from "./entity/raid.entity";
import { Repository } from "typeorm";

@Injectable()
export class RaidService {
  constructor(
    @InjectRepository(Raid)
    private readonly raidRepository: Repository<Raid>,
  ) {}
  
}