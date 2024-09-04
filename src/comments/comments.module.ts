import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MatchesModule } from '../matches/matches.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchCommentsModel } from './entity/match-comments.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MatchesModule,
    TypeOrmModule.forFeature([MatchCommentsModel]),
    AuthModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
