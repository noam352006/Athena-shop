import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum UserRole {
  Admin = 'Admin', 
  Guest = 'Guest'
}

registerEnumType(UserRole, {name: "UserRole"});

@ObjectType()
export class User {
  @Field() id: string;
  @Field() userName: string;
  @Field() passowrd: String;
  @Field(type => UserRole) role: UserRole;
  @Field() dateCreated: Date;
}