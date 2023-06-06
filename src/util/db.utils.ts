import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Offer as offerModel } from '../nft/schemas/offer.schema';
import { Nft as nftModel } from '../nft/schemas/nft.schema';
import { Nft as nftInterface } from '../nft/interfaces/nft.interface';
import { Offer as offerInterface } from '../nft/interfaces/offer.interface';

@Injectable()
export class DbUtils {
  constructor(
    @InjectModel(offerModel.name) private offerModel: Model<offerModel>,
    @InjectModel(nftModel.name) private nftModel: Model<nftModel>,
  ) {}

  async findOffer(
    filterParams = {},
    projection = 'token_id amount from to status created_at message',
  ): Promise<any> {
    try {
      const offers = await this.offerModel.find(filterParams, projection);

      return offers;
    } catch (error) {
      console.error('Error at findOffer\n\n', error);
    }
  }

  async saveOffer(offerData: offerInterface): Promise<any> {
    try {
      const offerCreated = new this.offerModel(offerData);
      const offerSaved = await offerCreated.save();

      return offerSaved;
    } catch (error) {
      console.error('Error at saving Offer\n\n', error);
    }
  }

  async saveNft(nftData: nftInterface): Promise<any> {
    try {
      const nftCreated = new this.nftModel(nftData);
      const nftSaved = await nftCreated.save();

      return nftSaved;
    } catch (error) {
      console.error('Error at saving Nft\n\n', error);
    }
  }

  async updateOfferById(id, updateParams): Promise<any> {
    try {
      await this.offerModel.findOneAndUpdate({ _id: id }, updateParams);
    } catch (error) {
      console.error('Error at update offer\n\n', error);
    }
  }

  async updateNftById(id, updateParams): Promise<any> {
    try {
      await this.nftModel.findOneAndUpdate({ _id: id }, updateParams);
    } catch (error) {
      console.error('Error at update nft\n\n', error);
    }
  }
}
