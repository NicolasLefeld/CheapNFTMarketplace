import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { NftModule } from './nft/nft.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), NftModule],
  controllers: [AppController],
})
export class AppModule {}
