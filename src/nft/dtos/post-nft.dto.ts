import { IsNotEmpty } from 'class-validator';

export class nftMintingDto {
  @IsNotEmpty()
  privateKey: string;
}
