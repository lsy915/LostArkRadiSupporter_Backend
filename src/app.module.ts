import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { getTypeOrmModule } from './common/TypeOrmModule';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ContentsModule } from './contents/contents.module';
import { ExpenditionModule } from './expendition/expendition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    getTypeOrmModule(),
    //모듈추가
    UserModule,
    AuthModule,
    ContentsModule,
    ExpenditionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
