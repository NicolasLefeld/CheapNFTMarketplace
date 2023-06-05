import { IsNotEmpty } from 'class-validator';

export class PostListingDto {
  @IsNotEmpty()
  tokenType: string;

  @IsNotEmpty()
  tokenId: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  auction: string;
}
