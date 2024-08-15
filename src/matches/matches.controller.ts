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
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { UserModel } from '../users/entity/users.entity';

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
  async getMatchHistory(@Param('id') id: string) {
    return this.matchesService.findMatchHistoryById(id);
  }

  @Post(':id/history')
  @UseGuards(AccessTokenGuard)
  async postMatchHistory(
    @User() user,
    @Param('id') id: string,
    @Body() dto: CreateMatchHistoryDto,
  ) {
    return this.matchesService.postMatchHistory(user, id, dto);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async patchMatch(
    @User() user,
    @Param('id') id: string,
    @Body() dto: UpdateMatchDto,
  ) {
    return this.matchesService.updateMatch(user, id, dto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deleteMatch(@User() user: UserModel, @Param('id') id: string) {
    return this.matchesService.deleteMatch(user, id);
  }

  @Post(':id/like')
  async likeMatch() {}

  @Delete(':id/like')
  async unlikeMatch() {}
}
