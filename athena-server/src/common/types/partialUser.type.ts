import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum UserRole {
  Admin = 'Admin', 
  Guest = 'Guest'
}
registerEnumType(UserRole, {name: "UserRole"});

@ObjectType()
export class PartialUser {
  @Field() id: string;
  @Field() userName: string;
  @Field() role: UserRole;
  @Field() dateCreated: Date;
}