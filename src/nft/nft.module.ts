import { Module } from '@nestjs/common';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { Offer as offerModel, OfferSchema } from './schemas/offer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Nft as nftModel, NftSchema } from './schemas/nft.schema';
import { DbUtils } from 'src/util/db.utils';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: offerModel.name, schema: OfferSchema },
      { name: nftModel.name, schema: NftSchema },
    ]),
  ],
  controllers: [NftController],
  providers: [NftService, DbUtils],
})
export class NftModule {}
