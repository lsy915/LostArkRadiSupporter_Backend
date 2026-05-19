import { BaseTimeEntity } from "@/common/entity/base-time.entuty";
import { Character } from "@/expendition/entity/character.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('raid')
export class Raid extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  guildId: string;

  @ManyToOne(() => Character)
  leader: Character;

  @ManyToMany(() => Character, (character) => character.raids, { nullable: true })
  @JoinTable()
  members: Character[] | null;
}