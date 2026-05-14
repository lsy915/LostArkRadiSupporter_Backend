import { ApiProperty } from "@nestjs/swagger";

export class BaseTimeDto {
  @ApiProperty({ example: "2026-01-01T00:00:00.000Z", description: '생성된 날짜' })
  createdAt: Date;

  @ApiProperty({ example: "2026-01-01T00:00:00.000Z", description: '수정된 날짜' })
  updatedAt: Date;

  @ApiProperty({ example: null, nullable: true, description: '삭제된 날짜' })
  deletedAt: Date | null;
}
