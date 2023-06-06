import { Injectable } from '@nestjs/common';
import { Web3Utils } from 'src/util/web3.utils';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Offer as offerModel } from './schemas/offer.schema';
import { Offer as offerInterface } from './interfaces/offer.interface';
import { Nft as nftModel } from './schemas/nft.schema';
import { Nft as nftInterface } from './interfaces/nft.interface';
import { NftOperations } from './constants/nftOperations.constans';
import { DbUtils } from 'src/util/db.utils';
import { offerStatus } from './constants/offerStatus.constans';

@Injectable()
export class NftService {
  constructor(
    private readonly dbUtils: DbUtils,
    @InjectModel(offerModel.name) private offerModel: Model<offerModel>,
    @InjectModel(nftModel.name) private nftModel: Model<nftModel>,
  ) {}

  async nftList() {
    try {
      const { ERC721CONTRACT: nftContractAddress } = process.env;
      const nftsListed = await Web3Utils.nftList(nftContractAddress);

      return nftsListed;
    } catch (error) {
      console.error('Error at NFT listing ', error);
    }
  }

  async nftListOffers() {
    try {
      const offers = await this.dbUtils.findOffer();

      return offers;
    } catch (error) {
      console.error('Error at NFT offer listing ', error);
    }
  }

  async nftMinting(privateKey: string) {
    try {
      const { ERC721CONTRACT: nftContractAddress } = process.env;

      const nftMintedHash = await Web3Utils.nftMinting(
        privateKey,
        nftContractAddress,
      );
      const walletAddress = Web3Utils.generatePublicAddress(privateKey);

      if (nftMintedHash) {
        const nft: nftInterface = {
          original_creator: walletAddress,
          owner: walletAddress,
          created_at: Date(),
          contractAddress: nftContractAddress,
          transactions: [
            { hash: nftMintedHash, from: '', operation: NftOperations.MINT },
          ],
        };

        const nftSaved = await this.dbUtils.saveNft(nft);

        return nftSaved;
      }
      return false;
    } catch (error) {
      console.error('Error at NFT Minting ', error);
    }
  }

  async nftMakeOffer(
    walletAddress: string,
    erc20CurrencyAmount: number,
    nftContractId: string,
    nftContractAddress: string,
    message: string,
  ) {
    try {
      const nftsFromBlockchain = await Web3Utils.nftList(nftContractAddress);

      const nftsFromBlockchainFiltered = nftsFromBlockchain.filter(
        ({ tokenId, contractAddress }) =>
          tokenId === nftContractId &&
          contractAddress === nftContractAddress.toLocaleLowerCase(),
      );

      if (nftsFromBlockchainFiltered.length > 0) {
        const offer: offerInterface = {
          token_id: nftContractId,
          amount: erc20CurrencyAmount,
          from: walletAddress,
          to: '',
          status: offerStatus.CREATED,
          created_at: Date(),
          message,
        };

        const offerSaved = await this.dbUtils.saveOffer(offer);

        return offerSaved;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error at NFT makeOffer ', error);
    }
  }

  async nftAcceptOffer(id, nftAcceptOfferBody) {
    try {
      const { bidderPrivateKey, ownerPrivateKey } = nftAcceptOfferBody;

      const offer = await this.dbUtils.findOffer({ _id: id });

      if (offer.length > 0) {
        const { token_id: tokenId, amount, message, from } = offer[0];

        const offerAccepted = await Web3Utils.nftAcceptOffer(
          tokenId,
          amount,
          bidderPrivateKey,
          ownerPrivateKey,
          message,
        );

        if (offerAccepted) {
          await this.dbUtils.updateOfferById(id, {
            status: offerStatus.FINISHED,
          });

          // TODO: Fix wront ID - The id that we have here is the offer one, no the nft id
          await this.dbUtils.updateNftById(id, {
            $push: {
              transactions: {
                hash: '',
                from,
                operation: NftOperations.TRANSFER,
              },
            },
          });

          return offerAccepted;
        }
      }

      return false; // Offer not found
    } catch (error) {
      console.error('Error at NFT makeOffer ', error);
    }
  }
}
