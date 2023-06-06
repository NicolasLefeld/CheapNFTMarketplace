import { Injectable } from '@nestjs/common';
import { Network, Alchemy, Utils } from 'alchemy-sdk';
import erc721Abi from '../abis/mockerc721.abi.json';
import erc20Abi from '../abis/mockerc20.abi.json';
import marketplaceAbi from '../abis/marketplace.abi.json';
import { ethers } from 'ethers';
import * as ethUtil from 'ethereumjs-util';

@Injectable()
export class Web3Utils {
  static async nftList(nftContractAddress) {
    const { ALCHEMY_API_KEY: apiKey } = process.env;

    const settings = {
      apiKey,
      network: Network.ETH_SEPOLIA,
    };

    const alchemy = new Alchemy(settings);
    const { nfts } = await alchemy.nft.getNftsForContract(nftContractAddress);

    const nftParsed = nfts.map((nft) => {
      return {
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId,
        title: nft.title,
        description: nft.description,
        lastUpdate: nft.timeLastUpdated,
        uri: nft.tokenUri || '',
      };
    });

    return nftParsed;
  }

  static async nftMinting(privateKey: string, nftContractAddress: string) {
    const { ALCHEMY_API_KEY: apiKey, NETWORK: network } = process.env;

    const provider = new ethers.AlchemyProvider(network, apiKey);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(nftContractAddress, erc721Abi, signer);

    const nftTxn = await contract.mint(signer.address);
    await nftTxn.wait();

    if (nftTxn.hash) return nftTxn.hash;
    return false;
  }

  static async nftAcceptOffer(
    tokenId: number,
    bid: number,
    bidderPrivateKey: string,
    ownerPrivateKey: string,
    message: string,
  ) {
    try {
      const {
        MARKETPLACECONTRACT: marketplaceContractAddress,
        ERC721CONTRACT: nftContractAddress,
        ERC20CONTRACT: erc20Address,
        ALCHEMY_API_KEY: apiKey,
        NETWORK: network,
      } = process.env;

      const provider = new ethers.AlchemyProvider(network, apiKey);
      const ownerSigner = this.generateSign(ownerPrivateKey, provider);
      const bidderSigner: ethers.Wallet = this.generateSign(
        bidderPrivateKey,
        provider,
      );

      const contract = new ethers.Contract(
        marketplaceContractAddress,
        marketplaceAbi,
        ownerSigner,
      );

      const auctionData = {
        collectionAddress: nftContractAddress,
        erc20Address,
        tokenId,
        bid,
      };

      const bidderSignature = Utils.arrayify(
        await bidderSigner.signMessage(message),
      );
      const ownerSignature = Utils.arrayify(
        await ownerSigner.signMessage(message),
      );

      // TODO: ERROR -> ERC20: insufficient allowance'
      const nftTxn = await contract.finishAuction(
        auctionData,
        bidderSignature,
        ownerSignature,
      );
      await nftTxn.wait();

      return true;
    } catch (error) {
      console.error('Error while accepting the offer\n\n', error);
      return false;
    }
  }

  static generateSign(privateKey: string, provider): any {
    const signer = new ethers.Wallet(privateKey, provider);

    return signer;
  }

  static generatePublicAddress(privateKey: string): string {
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const publicKeyBuffer = ethUtil.privateToPublic(privateKeyBuffer);
    const addressBuffer = ethUtil.publicToAddress(publicKeyBuffer);
    const address = addressBuffer.toString('hex');

    return address;
  }
}
