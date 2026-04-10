import { CreateDateColumn, DeleteDateColumn, Generated, UpdateDateColumn } from "typeorm";

export abstract class BaseTimeEntity {
  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime'})
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'datetime'})
  deletedAt: Date | null;
}