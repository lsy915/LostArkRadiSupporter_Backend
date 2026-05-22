import { BaseTimeEntity } from "@/common/entity/base-time.entuty";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Raid } from "./raid.entity";
import { Character } from "@/expendition/entity/character.entity";

export enum inviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

@Entity('raid_invite')
export class RaidInvite extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Raid)
  raid: Raid;

  @ManyToOne(() => Character)
  inviter: Character;

  @ManyToOne(() => Character)
  invitee: Character;

  @Column({ type: 'enum', enum: inviteStatus, default: inviteStatus.PENDING })
  status: inviteStatus;
}