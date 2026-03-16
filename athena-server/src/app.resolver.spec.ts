import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

describe('AppResolver', () => {
  let appResolver: AppResolver;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppResolver],
      providers: [AppService],
    }).compile();

    appResolver = app.get<AppResolver>(AppResolver);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
    });
  });
});
