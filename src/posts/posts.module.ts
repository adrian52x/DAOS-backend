import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './schema/post.schema';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), UsersModule, JwtModule],
	controllers: [PostsController],
	providers: [PostsService],
})
export class PostsModule {}
