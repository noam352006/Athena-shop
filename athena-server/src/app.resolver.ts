import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShoesService } from './common/graphql/item.service';
import { BasicShoeService } from './common/graphql/basicShoe.service';
import { UserService } from './common/graphql/user.service';
import { BasicShoe } from './common/types/basicShoe.type';
import { ShoeItem } from './common/types/shoeItem.type';
import { PartialUser } from './common/types/partialUser.type';


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
    return await this.basicShoeService.getAllBasicShoes();
  }

  //------------SHOE ITEMS-----------
  @Query(() => [ShoeItem])
  async getAllShoes() {
    return await this.itemService.getAllItems();
  }

  @Query(() => [ShoeItem])
  async getAllPurchases() {
    return await this.itemService.getAllPurchases();
  }

  @Mutation(() => Date)
  async purchaseItem(
    @Args('userId') userId: string,
    @Args('itemId') shoeId: string,
  ) {
    const result = await this.itemService.purchaseItem(userId, shoeId);
    return result ? new Date(result) : undefined;
  }

  //-----------USERS------------------
  @Query(() => PartialUser, { nullable: true })
  async getUserByCredentials(
    @Args('userPassword') userPassword: string,
    @Args('userName') userName: string,
  ) {
    return await this.userService.getUserByCredentials(userPassword, userName);
  }

  @Query(() => PartialUser, { nullable: true })
  async getUserByName(@Args('userName') userName: string) {
    return await this.userService.getUserByName(userName);
  }

  @Query(() => [String])
  async getUserPurchasedBrands(@Args('user_id') userId: string) {
    return await this.userService.getUserPurchasedBrands(userId);
  }

  @Mutation(() => PartialUser)
  async signUserUp(
    @Args('userPassword') userPassword: string,
    @Args('userName') userName: string,
  ) {
    return await this.userService.signUp(userPassword, userName);
  }
}
