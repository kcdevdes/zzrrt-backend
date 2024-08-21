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
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { SearchMatchesDto } from './dto/search-matches.dto';

@Controller('matches')
@ApiTags('Match API')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('search')
  async searchMatches(@Body() dto: SearchMatchesDto) {
    return this.matchesService.searchMatches(dto);
  }

  @Get(':id')
  async getMatchById(@Body() id: string): Promise<MatchModel> {
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
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const result = await this.matchesService.createMatch(user, dto);
      await qr.commitTransaction();
      return result;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    }
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
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const result = await this.matchesService.postMatchHistory(
        user,
        id,
        dto,
        qr,
      );
      await qr.commitTransaction();
      return result;
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    }
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

  @Get(':id/like')
  async getMatchLikeCounter(@Param('id') id: string) {
    return {
      count: await this.matchesService.getMatchLikeCounterById(id),
    };
  }

  @Post(':id/like')
  @UseGuards(AccessTokenGuard)
  async likeMatch(@User() user: UserModel, id: string) {
    return this.matchesService.likeMatch(user, id);
  }

  @Delete(':id/like')
  @UseGuards(AccessTokenGuard)
  async unlikeMatch(@User() user: UserModel, id: string) {
    return this.matchesService.unlikeMatch(user, id);
  }
}
