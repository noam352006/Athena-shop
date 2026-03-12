import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { BasicShoeService } from './services/basicShoe.service';
import { ShoesService } from './services/item.service';
import { UserService } from './services/user.service';
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
