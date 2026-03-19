import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { ApolloClientProvider } from './apollo.provider';
import { ConfigModule } from '@nestjs/config';
import { Queries } from './common/graphqL/queries';
import { Mutations } from './common/graphqL/mutation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // Nest ייצר את קובץ הסכימה לבד בזיכרון
    }),
  ],
  providers: [
    AppService,
    AppResolver,
    ApolloClientProvider,
    Queries,
    Mutations
  ],
})
export class AppModule {}
