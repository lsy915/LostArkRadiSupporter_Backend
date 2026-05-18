import { BaseTimeEntity } from "@/common/entity/base-time.entuty";
import { Expendition } from "@/expendition/entity/expendition.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  discordId: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  apiKey: string;

  @Column({ type: 'text', nullable: true })
  discordAccessToken: string;

  @OneToMany(() => Expendition, (expendition) => expendition.user, { nullable: true })
  expenditions: Expendition[] | null;
}
