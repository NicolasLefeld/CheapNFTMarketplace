import { nftMintingDto } from 'src/nft/dtos/post-nft.dto';
import { nftMakeOfferDto } from './dtos/post-nft-offer.dto';
import { NftService } from './nft.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('')
  async nftList(@Res() response): Promise<any> {
    const nftListed = await this.nftService.nftList();

    if (nftListed.length > 0)
      return response.status(HttpStatus.OK).send(nftListed);
    return response.status(HttpStatus.NOT_FOUND).send('Any NFT found');
  }

  @Get('offers')
  async nftListOffers(@Res() response): Promise<any> {
    const nftOfferListed = await this.nftService.nftListOffers();

    if (nftOfferListed.length > 0)
      return response.status(HttpStatus.OK).send(nftOfferListed);
    return response.status(HttpStatus.NOT_FOUND).send('Any NFT offer found');
  }

  @Post('')
  async nftMinting(
    @Body() nftMintingDto: nftMintingDto,
    @Res() response,
  ): Promise<any> {
    const { privateKey } = nftMintingDto;

    const nftMinted = await this.nftService.nftMinting(privateKey);

    if (nftMinted) return response.status(HttpStatus.CREATED).send(nftMinted);
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("Can't mint NFT");
  }

  @Post('/:nftContractId/:nftContractAddress/offer')
  async nftMakeOffer(
    @Body() nftMakeOfferBody: nftMakeOfferDto,
    @Param() nftMakeOfferParam,
    @Res() response,
  ): Promise<any> {
    const { walletAddress, erc20CurrencyAmount, message } = nftMakeOfferBody;
    const { nftContractId, nftContractAddress } = nftMakeOfferParam;

    const nftOfferMaked = await this.nftService.nftMakeOffer(
      walletAddress,
      erc20CurrencyAmount,
      nftContractId,
      nftContractAddress,
      message,
    );

    if (nftOfferMaked)
      return response.status(HttpStatus.CREATED).send(nftOfferMaked);
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send('Error while creating the offer');
  }

  @Put('/offer/:id')
  async nftAcceptOffer(
    @Body() nftAcceptOfferBody,
    @Param() nftAcceptOfferParam,
    @Res() response,
  ): Promise<any> {
    const { id } = nftAcceptOfferParam;

    const nftOfferAccepted = await this.nftService.nftAcceptOffer(
      id,
      nftAcceptOfferBody,
    );

    if (nftOfferAccepted)
      return response.status(HttpStatus.OK).send(nftOfferAccepted);
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send('Error while accepting the offer');
  }
}
