import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Nft {
  @Prop()
  original_creator: string;
  @Prop()
  owner: string;
  @Prop()
  created_at: Date;
  @Prop()
  contractAddress: string;
  @Prop()
  message: string;
  @Prop()
  transactions: [];
}

export const NftSchema = SchemaFactory.createForClass(Nft);
