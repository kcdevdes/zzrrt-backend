import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchModel } from './entity/matches.entity';
import { In, Repository } from 'typeorm';
import { UserModel } from '../users/entity/users.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchHistoryModel } from './entity/match-histories.entity';
import { MatchChoiceModel } from './entity/match-choices.entity';
import { MatchOptionModel } from './entity/match-options.entity';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';

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
    matchId: string,
    dto: CreateMatchHistoryDto,
  ): Promise<MatchHistoryModel> {
    const { userId, choices } = dto;

    // Checks if the match and user exist
    const match = await this.matchesRepository.findOne({
      where: { id: matchId },
    });
    if (!match) {
      throw new NotFoundException('No such match');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('No such user');
    }

    // Creates a new match history
    const matchHistory = this.matchHistoriesRepository.create({
      match,
      creator: user,
    });

    // Saves it
    const savedHistory = await this.matchHistoriesRepository.save(matchHistory);

    // Saves all provided options and the choice of the user
    for (const choiceDto of choices) {
      const { selectedOptionId, allOptionsIds } = choiceDto;

      const selectedOption = await this.matchOptionsRepository.findOneBy({
        id: selectedOptionId,
      });
      if (!selectedOption) {
        throw new NotFoundException('No such match option');
      }

      const allOptions = await this.matchOptionsRepository.find({
        where: {
          id: In(allOptionsIds),
        },
      });

      const choice = this.matchChoicesRepository.create({
        matchHistory: savedHistory,
        selectedOption,
        allOptions,
      });

      await this.matchChoicesRepository.save(choice);
    }

    return savedHistory;
  }

  async updateMatch() {}

  async deleteMatch() {}

  async postOptions() {}
}
