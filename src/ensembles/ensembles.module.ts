import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnsemblesService } from './ensembles.service';
import { EnsemblesController } from './ensembles.controller';
import { Ensemble, EnsembleSchema } from './schema/ensemble.schema';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ensemble.name, schema: EnsembleSchema }]),
    UsersModule,
    JwtModule
  ],
  controllers: [EnsemblesController],
  providers: [EnsemblesService],
  exports: [EnsemblesService],
})
export class EnsemblesModule {}