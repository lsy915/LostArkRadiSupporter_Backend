import { BaseTimeEntity } from "@/common/entity/base-time.entuty";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Expendition } from "./expendition.entity";

@Entity('character')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  characterName: string;

  @Column()
  characterClassName: string;

  @Column()
  characterAvgLevel: string;

  @Column()
  combatPower: string;

  @Column()
  characterImage: string;

  @Column({ nullable: true })
  guildName: string;

  @ManyToOne(() => Expendition, (expendition) => expendition.characters)
  expendition: Expendition;
}
