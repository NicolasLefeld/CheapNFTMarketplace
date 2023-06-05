import { IsNotEmpty } from 'class-validator';

export class PostOfferListingDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  bidAmount: number;

  @IsNotEmpty()
  buyNow: boolean;
}
