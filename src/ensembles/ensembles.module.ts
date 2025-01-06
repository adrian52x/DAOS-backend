import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnsemblesService } from './ensembles.service';
import { EnsemblesController } from './ensembles.controller';
import { Ensemble, EnsembleSchema } from './schema/ensemble.schema';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Post, PostSchema } from '../posts/schema/post.schema';
import { PostsModule } from '../posts/posts.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Ensemble.name, schema: EnsembleSchema },
			{ name: Post.name, schema: PostSchema },
		]),
		UsersModule,
		JwtModule,
		forwardRef(() => PostsModule), //https://docs.nestjs.com/fundamentals/circular-dependency
	],
	controllers: [EnsemblesController],
	providers: [EnsemblesService],
	exports: [EnsemblesService],
})
export class EnsemblesModule {}
