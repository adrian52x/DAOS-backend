import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongoConfigModule } from './config/database/mongo/config.module';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongoConfigModule,
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
