import { Field, ObjectType } from "@nestjs/graphql";

export enum UserRole {
    Manager, 
    Client
}

@ObjectType()
export class User {
  @Field() id: string;
  @Field() userName: string;
  @Field() passowrd: String;
  @Field() role: UserRole;
  @Field() dateCreated: string;
}