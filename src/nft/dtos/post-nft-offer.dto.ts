import { IsNotEmpty } from 'class-validator';

export class nftMakeOfferDto {
  @IsNotEmpty()
  walletAddress: string;

  @IsNotEmpty()
  erc20CurrencyAmount: number;

  @IsNotEmpty()
  message: string;
}
