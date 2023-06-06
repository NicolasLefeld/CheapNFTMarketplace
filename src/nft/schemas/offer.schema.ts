import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Offer {
  @Prop()
  token_id: string;

  @Prop()
  amount: number;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop()
  status: string;

  @Prop()
  message: string;

  @Prop()
  created_at: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
