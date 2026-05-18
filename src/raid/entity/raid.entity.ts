import { BaseTimeEntity } from "@/common/entity/base-time.entuty";
import { Character } from "@/expendition/entity/character.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('raid')
export class Raid extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  guildId: string;

  @ManyToOne(() => Character)
  leader: Character;

  @ManyToMany(() => Character, (character) => character.raids)
  @JoinTable()
  members: Character[];
}