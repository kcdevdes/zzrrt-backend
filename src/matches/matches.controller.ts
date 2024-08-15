import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchModel } from './entity/matches.entity';
import { AccessTokenGuard } from '../auth/guards/bearer-token.guard';
import { User } from '../users/decorator/user.decorator';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get(':id')
  async getMatchById(@Param('id') id: string): Promise<MatchModel> {
    return this.matchesService.findMatchById(id);
  }

  @Get()
  async getAllMatches() {
    return this.matchesService.findAllMatches();
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async postMatch(
    @User() user,
    @Body() dto: CreateMatchDto,
  ): Promise<MatchModel> {
    return this.matchesService.createMatch(user, dto);
  }

  @Get(':id/history')
  async getMatchHistory() {}

  @Post(':id/history')
  @UseGuards(AccessTokenGuard)
  async postMatchHistory(@User() user, @Param('id') id: string) {}

  @Patch(':id')
  async patchMatch() {}

  @Delete(':id')
  async deleteMatch() {}

  @Post(':id/like')
  async likeMatch() {}

  @Delete(':id/like')
  async unlikeMatch() {}

  @Get(':id/comment')
  async getComments() {}

  @Post(':id/comment')
  async addComment() {}

  @Patch(':match_id/comment/:comment_id')
  async patchComment() {}

  @Delete(':match_id/comment/:comment_id')
  async deleteComment() {}
}
