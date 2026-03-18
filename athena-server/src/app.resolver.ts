import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShoesService } from './services/item.service';
import { BasicShoeService } from './services/basicShoe.service';
import { UserService } from './services/user.service';
import { BasicShoe } from './classes/basicShoe';
import { ShoeItem } from './classes/shoeItem';
import { PartialUser } from './classes/partialUser';

@Resolver()
export class AppResolver {
  constructor(
    private readonly basicShoeService: BasicShoeService,
    private readonly itemService: ShoesService,
    private readonly userService: UserService,
  ) {}

  //------BASIC SHOES---------------
  @Query(() => [BasicShoe])
  async getAllBasicShoes() {
    try {
      return await this.basicShoeService.getAllBasicShoes();
    } catch (error) {
      console.error('Error fetching basic shoes at getAllBasicShoes()', error);
      throw error;
    }
  }

  //------------SHOE ITEMS-----------
  @Query(() => [ShoeItem])
  async getAllShoes() {
    try {
      return await this.itemService.getAllItems();
    } catch (error) {
      console.error('Error fetching shoes at getAllShoes()', error);
      throw error;
    }
  }

  @Query(() => [ShoeItem])
  async getAllPurchases() {
    try {
      return await this.itemService.getAllPurchases();
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
      const result = await this.itemService.purchaseItem(userId, shoeId);
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
      return await this.userService.getUserByCredentials(userPassword, userName);
    } catch (error) {
      console.error('Error fetching user by credentials at getUserByCredentials()', error);
      throw error;
    }
  }

  @Query(() => PartialUser, { nullable: true })
  async getUserByName(@Args('userName') userName: string) {
    try {
      return await this.userService.getUserByName(userName);
    } catch (error) {
      console.error('Error fetching user by name at getUserByName()', error);
      throw error;
    }
  }

  @Query(() => [String])
  async getUserPurchasedBrands(@Args('user_id') userId: string) {
    try {
      return await this.userService.getUserPurchasedBrands(userId);
    } catch (error) {
      console.error('Error fetching purchased brands at getUserPurchasedBrands()', error);
      throw error;
    }
  }

  @Mutation(() => PartialUser)
  async signUserUp(
    @Args('userPassword') userPassword: string,
    @Args('userName') userName: string,
  ) {
    try {
      return await this.userService.signUp(userPassword, userName);
    } catch (error) {
      console.error('Error inserting user at signUp()', error);
      throw error;
    }
  }
}