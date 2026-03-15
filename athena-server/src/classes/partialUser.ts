import { Field, ObjectType } from "@nestjs/graphql";
import { UserRole } from "./user";

@ObjectType()
export class PartialUser {
  @Field() id: string;
  @Field() userName: string;
  @Field() role: UserRole;
  @Field() dateCreated: Date;
}