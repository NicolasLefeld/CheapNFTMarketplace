import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostListingDto } from 'src/nft/dtos/post-listing.dto';
import { NftService } from './nft.service';
import { PostOfferListingDto } from './dtos/post-offer-listing.dto';

@Controller('nft')
export class NftController {
  @Get('')
  async nftList(): Promise<any> {
    return await NftService.nftList();
  }

  @Get('offers')
  async nftListOffers(): Promise<any> {
    return await NftService.nftListOffers();
  }

  @Post('')
  async nftMinting(@Body() nftMintingDto: nftMintingDto): Promise<any> {
    return await NftService.nftMinting(nftMintingDto);
  }

  // @Body() postOfferListingDto: PostOfferListingDto

  @Post('/:id/offer')
  async nftMakeOffer(): Promise<any> {
    return NftService.nftMakeOffer();
  }
}
