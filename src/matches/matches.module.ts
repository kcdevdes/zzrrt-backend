import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModel } from './entity/matches.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MatchModel]), AuthModule, UsersModule],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
