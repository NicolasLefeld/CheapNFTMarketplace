import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { NftModule } from './nft/nft.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'cheap_marketplace',
    }),
    NftModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
