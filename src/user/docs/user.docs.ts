import { ApiProperty } from "@nestjs/swagger";
import { BaseTimeDto } from "@/common/docs/base-time.docs";
import { GetExpenditionByDto } from "@/expendition/docs/expendition.docs";

export class GetUserByDto extends BaseTimeDto {
  @ApiProperty({ example: '123456a123-1234-1a3a-1234-1222222', description: '사용자 ID' })
  id: string;

  @ApiProperty({ example: '12341234', description: '사용자 디스코드 ID' })
  discordId: string;

  @ApiProperty({ example: 'username', description: '사용자 디스코드 이름' })
  username: string;

  @ApiProperty({ example: '1111111111', nullable: true, description: '사용자 아바타링크' })
  avatar: string;

  @ApiProperty({ example: 'abc@abc.com', nullable: true, description: '사용자 이메일' })
  email: string;

  @ApiProperty({
    type: () => GetExpenditionByDto,
    isArray: true,
    nullable: true,
    description: '사용자 원정대 없으면 항목X',
  })
  expenditions: GetExpenditionByDto[] | null;
}

export class validSuccessApi {
  @ApiProperty({ example: true, description: '로아 API 증명 성공' })
  vaild: boolean;
}