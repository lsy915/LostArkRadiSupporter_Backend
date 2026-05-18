import { BaseTimeEntity } from "@/common/entity/base-time.entuty";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Expendition } from "./expendition.entity";
import { Raid } from "@/raid/entity/raid.entity";

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  characterName: string;

  @Column()
  characterClassName: string;

  @Column()
  characterAvgLevel: string;

  @Column({ nullable: true })
  combatPower: string;

  @Column({ nullable: true })
  characterImage: string;

  @Column({ nullable: true })
  guildName: string;

  @ManyToOne(() => Expendition, (expendition) => expendition.characters, { onDelete: 'CASCADE' })
  expendition: Expendition;

  @ManyToMany(() => Raid, (raid) => raid.members, { nullable: true })
  raids: Raid[] | null;
}
