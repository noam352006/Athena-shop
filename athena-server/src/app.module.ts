import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { BasicShoeService } from './common/graphqL/basicShoe.service';
import { ShoesService } from './common/graphqL/item.service';
import { UserService } from './common/graphqL/user.service';
import { ApolloClientProvider } from './apollo.provider';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // Nest ייצר את קובץ הסכימה לבד בזיכרון
    }),
  ],
  providers: [
    AppService,
    AppResolver,
    ApolloClientProvider,
    BasicShoeService,
    ShoesService,
    UserService,
  ],
})
export class AppModule {}
