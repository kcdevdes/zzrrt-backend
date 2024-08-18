import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchModel } from './entity/matches.entity';
import { In, Like, QueryRunner, Repository } from 'typeorm';
import { UserModel } from '../users/entity/users.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchHistoryModel } from './entity/match-histories.entity';
import { MatchChoiceModel } from './entity/match-choices.entity';
import { MatchOptionModel } from './entity/match-options.entity';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { SearchMatchesDto } from './dto/search-matches.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchModel)
    private readonly matchesRepository: Repository<MatchModel>,
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
    @InjectRepository(MatchHistoryModel)
    private readonly matchHistoriesRepository: Repository<MatchHistoryModel>,
    @InjectRepository(MatchChoiceModel)
    private readonly matchChoicesRepository: Repository<MatchChoiceModel>,
    @InjectRepository(MatchOptionModel)
    private readonly matchOptionsRepository: Repository<MatchOptionModel>,
  ) {}

  async createMatch(
    creator: UserModel,
    dto: CreateMatchDto,
  ): Promise<MatchModel> {
    try {
      // Pushes all options to the database first
      const options: MatchOptionModel[] = [];
      for (const option of dto.options) {
        const newOption = this.matchOptionsRepository.create({
          name: option.name,
          description: option.description,
          resourceUrl: option.resourceUrl,
        });
        await this.matchOptionsRepository.save(newOption);
        options.push(newOption);
      }

      // Creaates a new match with the provided options
      const newMatch = this.matchesRepository.create({
        creator,
        title: dto.title,
        description: dto.description,
        options,
      });
      return await this.matchesRepository.save(newMatch);
    } catch (err) {
      throw new InternalServerErrorException('Failed to create a new match');
    }
  }

  async findAllMatches() {
    try {
      return await this.matchesRepository.find({
        relations: ['creator', 'options'],
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to find available matches',
      );
    }
  }

  async findMatchById(matchId: string) {
    const existingMatch = await this.matchesRepository.findOne({
      where: { id: matchId },
      relations: ['creator', 'options'],
    });
    if (!existingMatch) {
      throw new NotFoundException('No such match');
    }

    return existingMatch;
  }

  async postMatchHistory(
    user: UserModel,
    matchId: string,
    dto: CreateMatchHistoryDto,
    qr?: QueryRunner,
  ): Promise<MatchHistoryModel> {
    const { choices } = dto;

    // Checks if the match and user exist
    const match = await this.matchesRepository.findOne({
      where: { id: matchId },
    });
    if (!match) {
      throw new NotFoundException('No such match');
    }

    if (!user) {
      throw new NotFoundException('No such user');
    }

    // DB Transaction Repositories
    const historyRepository = qr
      ? qr.manager.getRepository(MatchHistoryModel)
      : this.matchHistoriesRepository;
    const choiceRepository = qr
      ? qr.manager.getRepository(MatchChoiceModel)
      : this.matchChoicesRepository;

    // Creates and saves a new match history
    const matchHistory = historyRepository.create({
      match,
      player: user,
    });

    const savedHistory = await historyRepository.save(matchHistory);

    // Saves all provided options and the choice of the user
    for (const choiceDto of choices) {
      const { selectedOptionId, allOptionsIds } = choiceDto;

      const selectedOption = await this.matchOptionsRepository.findOne({
        where: { id: selectedOptionId },
      });
      if (!selectedOption) {
        throw new NotFoundException('No such match option');
      }

      const allOptions = await this.matchOptionsRepository.find({
        where: {
          id: In(allOptionsIds),
        },
      });

      const choice = choiceRepository.create({
        matchHistory: savedHistory,
        selectedOption,
        allOptions,
      });

      await choiceRepository.save(choice);
    }

    return savedHistory;
  }

  async findMatchHistoryById(matchId: string) {
    const existingHistories = await this.matchHistoriesRepository.find({
      where: { match: { id: matchId } },
      relations: ['player', 'match', 'choices'],
    });
    if (!existingHistories) {
      throw new NotFoundException('No such match history');
    }

    return existingHistories;
  }

  async updateMatch(user: UserModel, id: string, dto: UpdateMatchDto) {
    const existingMatch = await this.matchesRepository.findOne({
      where: { id },
    });

    if (!existingMatch) {
      throw new NotFoundException('No such match');
    }

    if (user.id !== existingMatch.creator.id) {
      throw new UnauthorizedException('You are not the creator of this match');
    }

    await this.matchesRepository.save({
      ...existingMatch,
      ...dto,
    });

    return true;
  }

  async deleteMatch(user: UserModel, id: string) {
    const existingMatch = await this.matchesRepository.findOne({
      where: { id },
    });

    if (!existingMatch) {
      throw new NotFoundException('No such match');
    }

    if (user.id !== existingMatch.creator.id) {
      throw new UnauthorizedException('You are not the creator of this match');
    }

    await this.matchesRepository.delete({ id });

    return true;
  }

  async postOptions() {}

  async findCommentsOfMatchById(id: string) {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!match) {
      throw new NotFoundException('No such match');
    }

    return match.comments;
  }

  async likeMatch(user: UserModel, id: string) {
    const match = await this.matchesRepository.findOne({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException('No such match');
    }

    if (match.likedUsers.includes(user)) {
      throw new BadRequestException('You have already liked this match');
    }

    match.likedUsers.push(user);
    await this.matchesRepository.save(match);
    return true;
  }

  async unlikeMatch(user: UserModel, id: string) {
    const match = await this.matchesRepository.findOne({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException('No such match');
    }

    if (!match.likedUsers.includes(user)) {
      throw new BadRequestException('You have not liked this match');
    }

    match.likedUsers = match.likedUsers.filter(
      (likedUser) => likedUser !== user,
    );
    await this.matchesRepository.save(match);
    return true;
  }

  async searchMatches(dto: SearchMatchesDto): Promise<MatchModel[]> {
    const { query = '' } = dto;
    try {
      return await this.matchesRepository.find({
        where: [
          { title: Like(`%${query}%`) },
          { description: Like(`%${query}%`) },
        ],
        relations: ['creator', 'options'],
      });
    } catch (err) {
      throw new InternalServerErrorException('Failed to search matches');
    }
  }
}
