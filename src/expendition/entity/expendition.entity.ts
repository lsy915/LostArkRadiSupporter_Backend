import { BaseTimeEntity } from "@/common/entity/base-time.entuty";
import { User } from "@/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character.entity";

@Entity('expendition')
export class Expendition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.expenditions)
  user: User;

  @OneToMany(() => Character, (character) => character.expendition, { nullable: true })
  characters: Character[] | null;
}
