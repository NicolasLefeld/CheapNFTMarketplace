import { Injectable } from '@nestjs/common';
import { Web3Utils } from 'src/util/web3Utils';

@Injectable()
export class NftService {
  static async nftList() {
    try {
      const nftsListed = await Web3Utils.nftList();

      return nftsListed;
    } catch (error) {
      console.error('Error at NFT listing ', error);
    }
  }

  static async nftListOffers() {
    try {
      const nftsListed = await Web3Utils.nftListOffers();

      return nftsListed;
    } catch (error) {
      console.error('Error at NFT listing ', error);
    }
  }

  static async nftMinting() {
    try {
      const nftMinted = await Web3Utils.nftMinting(
        '3347addcf08db6ed226855d30f6839b44a3f5753e0affdf82d58ece3cd489903',
      );

      return nftMinted;
    } catch (error) {
      console.error('Error at NFT Minting ', error);
    }
  }

  static async nftMakeOffer() {
    try {
      const offerMaked = await Web3Utils.nftMakeOffer(
        '0x14B695d58dCbF57F5ed997b8AF0d27D1bC7Ffb8B',
        '2',
        10,
        '3347addcf08db6ed226855d30f6839b44a3f5753e0affdf82d58ece3cd489903',
      );

      return offerMaked;
    } catch (error) {
      console.error('Error at NFT makeOffer ', error);
    }
  }
}
