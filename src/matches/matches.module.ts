import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModel } from './entity/matches.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MatchHistoryModel } from './entity/match-histories.entity';
import { MatchOptionModel } from './entity/match-options.entity';
import { MatchChoiceModel } from './entity/match-choices.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatchModel,
      MatchHistoryModel,
      MatchOptionModel,
      MatchChoiceModel,
    ]),
    AuthModule,
    UsersModule,
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [MatchesService],
})
export class MatchesModule {}
