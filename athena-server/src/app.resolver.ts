import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BasicShoe } from './common/types/basic-shoe.type';
import { ShoeItem } from './common/types/shoeItem.type';
import { PartialUser } from './common/types/partialUser.type';
import { Queries } from './common/graphqL/queries';
import { Mutations } from './common/graphqL/mutation';


@Resolver()
export class AppResolver {
  constructor(
    private readonly queries: Queries,
    private readonly mutation: Mutations,
  ) {}

  //------BASIC SHOES---------------
  @Query(() => [BasicShoe])
  async getAllBasicShoes() {
    try {
      return await this.queries.getAllBasicShoes();
    } catch (error) {
      console.error('Error fetching basic shoes at getAllBasicShoes()', error);
      throw error;
    }
  }

  //------------SHOE ITEMS-----------
  @Query(() => [ShoeItem])
  async getAllShoes() {
    try {
      return await this.queries.getAllItems();
    } catch (error) {
      console.error('Error fetching shoes at getAllShoes()', error);
      throw error;
    }
  }

  @Query(() => [ShoeItem])
  async getAllPurchases() {
    try {
      return await this.queries.getAllPurchases();
    } catch (error) {
      console.error('Error fetching purchases at getAllPurchases()', error);
      throw error;
    }
  }

  @Mutation(() => Date, { nullable: true })
  async purchaseItem(
    @Args('userId') userId: string,
    @Args('itemId') shoeId: string,
  ) {
    try {
      const result = await this.mutation.purchaseItem(userId, shoeId);
      return result ? new Date(result) : undefined;
    } catch (error) {
      console.error('Error purchasing item at purchaseItem()', error);
      throw error;
    }
  }

  //-----------USERS------------------
  @Query(() => PartialUser, { nullable: true })
  async getUserByCredentials(
    @Args('userPassword') userPassword: string,
    @Args('userName') userName: string,
  ) {
    try {
      return await this.queries.getUserByCredentials(
        userPassword,
        userName,
      );
    } catch (error) {
      console.error(
        'Error fetching user by credentials at getUserByCredentials()',
        error,
      );
      throw error;
    }
  }

  @Query(() => PartialUser, { nullable: true })
  async getUserByName(@Args('userName') userName: string) {
    try {
      return await this.queries.getUserByName(userName);
    } catch (error) {
      console.error('Error fetching user by name at getUserByName()', error);
      throw error;
    }
  }

  @Query(() => [String])
  async getUserPurchasedBrands(@Args('user_id') userId: string) {
    try {
      return await this.queries.getUserPurchasedBrands(userId);
    } catch (error) {
      console.error(
        'Error fetching purchased brands at getUserPurchasedBrands()',
        error,
      );
      throw error;
    }
  }

  @Mutation(() => PartialUser)
  async signUserUp(
    @Args('userPassword') userPassword: string,
    @Args('userName') userName: string,
  ) {
    try {
      return await this.mutation.signUp(userPassword, userName);
    } catch (error) {
      console.error('Error inserting user at signUp()', error);
      throw error;
    }
  }
}
