import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum Brands {
  Adidas = "Adidas",
  Nike = "Nike",
  Yeezy = "Yeezy",
  Air_Jordan = "Air_Jordan",
  Puma = "Puma",
  Off___White = "Off___White"
}

registerEnumType(Brands, {name: "Brands"});

@ObjectType()
export class BasicShoe {
  @Field() id: string;
  @Field(type => [Brands]) brand: Brands[];
  @Field() model: string;
  @Field() price: number;
  @Field() rating: number;
  @Field() imgUrl: string;
}