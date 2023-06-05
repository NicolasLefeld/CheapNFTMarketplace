import { Injectable } from '@nestjs/common';
import { Network, Alchemy } from 'alchemy-sdk';
import erc721Abi from '../abis/mockerc721.abi.json';
import { ethers } from 'ethers';

@Injectable()
export class Web3Utils {
  static async nftList() {
    const {
      ERC731CONTRACT: nftContractAddress,
      ALCHEMY_API_KEY: apiKey,
      NETWORK: network,
    } = process.env;

    const settings = {
      apiKey,
      network: Network.ETH_SEPOLIA,
    };

    const alchemy = new Alchemy(settings);
    const { nfts } = await alchemy.nft.getNftsForContract(nftContractAddress);
    console.log('\n\n', { nfts }, '\n\n');
    const nftParsed = nfts.map((nft) => {
      return {
        tokenId: nft.tokenId,
        title: nft.title,
        description: nft.description,
        lastUpdate: nft.timeLastUpdated,
        uri: nft.tokenUri || '',
      };
    });

    return nftParsed;
  }

  static async nftListOffers() {
    return 'nftParsed';
  }

  static async nftMinting(privateKey: string) {
    const {
      ERC731CONTRACT: nftContractAddress,
      ALCHEMY_API_KEY: apiKey,
      NETWORK: network,
    } = process.env;

    const provider = new ethers.AlchemyProvider(network, apiKey);

    const signer = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(nftContractAddress, erc721Abi, signer);

    const nftTxn = await contract.mintNFT(signer.address);
    await nftTxn.wait();

    if (nftTxn.hash) return nftTxn.hash;
    return false;
  }

  static async nftMakeOffer(
    walletAddress: string,
    nftContractId: string,
    erc20CurrencyAmount: number,
    privateKey: string,
  ) {
    const { ERC731CONTRACT: nftContractAddress } = process.env;

    // Crear el mensaje de oferta
    const offerMessage = {
      nftContractAddress: nftContractAddress,
      erc20CurrencyAddress: walletAddress,
      nftContractId,
      erc20CurrencyAmount: erc20CurrencyAmount,
    };

    // Firmar el mensaje de oferta
    // const privateKey =
    //   '3347addcf08db6ed226855d30f6839b44a3f5753e0affdf82d58ece3cd489903'; // Clave privada del remitente
    const signer = new ethers.Wallet(privateKey);
    const signature = await signer.signMessage(JSON.stringify(offerMessage));

    // El mensaje de oferta firmado
    const offerSignedMessage = {
      ...offerMessage,
      signature: signature,
    };

    console.log('Offer signed message:', offerSignedMessage);
  }
}
