import { Field, ObjectType } from '@nestjs/graphql';
import { BasicShoe } from './basicShoe';

@ObjectType()
export class ShoeItem {
  @Field() id: string;
  @Field() shoe: BasicShoe;
  @Field() dateCreated: Date;
  @Field() datePurchased?: Date;
  @Field() size: number;
}
