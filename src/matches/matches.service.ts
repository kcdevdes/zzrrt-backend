import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchModel } from './entity/matches.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { UserModel } from '../users/entity/users.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchHistoryModel } from './entity/match-histories.entity';
import { MatchChoiceModel } from './entity/match-choices.entity';
import { MatchOptionModel } from './entity/match-options.entity';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { SearchField, SearchMatchesDto } from './dto/search-matches.dto';

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

  /**
   * Creates a new match with the provided options
   * If the transaction is failed, it will be rolled back
   * @param creator
   * @param dto
   * @param qr
   */
  async createMatch(creator: UserModel, dto: CreateMatchDto, qr?: QueryRunner) {
    // DB Transaction Repositories
    const matchOptionsRepository = qr
      ? qr.manager.getRepository(MatchOptionModel)
      : this.matchOptionsRepository;
    const matchesRepository = qr
      ? qr.manager.getRepository(MatchModel)
      : this.matchesRepository;

    // Creaates a new match with the provided options
    const newMatch = matchesRepository.create({
      creator,
      title: dto.title,
      description: dto.description,
    });
    const savedMatch: MatchModel = await matchesRepository.save(newMatch);

    // Pushes all options to the database first
    const options: MatchOptionModel[] = [];
    for (const option of dto.options) {
      const newOption = matchOptionsRepository.create({
        name: option.name,
        description: option.description,
        resourceUrl: option.resourceUrl,
      });
      options.push(await matchOptionsRepository.save(newOption));
    }

    // Links the options to the match
    savedMatch.options = options;
    return await matchesRepository.save(savedMatch);
  }

  /**
   * Finds all matches
   * TODO: Implement pagination
   */
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

  /**
   * Finds all match options of a match
   * If the transaction is failed, it will be rolled back
   * @param user
   * @param matchId
   * @param dto
   * @param qr
   */
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

  /**
   * Finds all match histories of a match
   * @param matchId
   */
  async findMatchHistoryById(matchId: string) {
    const existingHistories = await this.matchHistoriesRepository.find({
      where: { match: { id: matchId } },
      relations: {
        player: true,
        match: true,
        choices: true,
      },
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

  /**
   * Finds all comments of a match
   * TODO: Implement pagination
   * @param id
   */
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

  /**
   * Likes the match
   * ONLY if the user has not liked the match before
   * @param user
   * @param id
   */
  async likeMatch(user: UserModel, id: string) {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: {
        likedUsers: true,
      },
    });

    if (!match) {
      throw new NotFoundException('No such match');
    }

    /*
      Saves the user's like
     */
    if (match.likedUsers === undefined) {
      match.likedUsers = [user];
      return true;
    }

    // Checks if the user has already liked the match
    if (!match.likedUsers.some((u) => u.id === user.id)) {
      match.likedUsers.push(user);
    } else {
      throw new BadRequestException('You already liked this match');
    }

    await this.matchesRepository.save(match);
    return true;
  }

  /**
   * Removes the user's like from the match
   * ONLY if the user has already liked the match
   * @param user
   * @param id
   */
  async unlikeMatch(user: UserModel, id: string) {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: {
        likedUsers: true,
      },
    });

    if (!match) {
      throw new NotFoundException('No such match');
    }

    /*
      Removes the user's like
     */
    if (match.likedUsers === undefined) {
      throw new BadRequestException('You have not liked this match');
    }

    // Checks if the user has already liked the match
    if (match.likedUsers.some((u) => u.id === user.id)) {
      match.likedUsers = match.likedUsers.filter((u) => u.id !== user.id);
    } else {
      throw new BadRequestException('You have not liked this match');
    }

    await this.matchesRepository.save(match);
    return true;
  }

  // AI 미쳤네... 이걸 다 만들어 주네 ㅋㅋㅋㅋㅋㅋㅋ
  /**
   * Searches matches by the given query and fields
   * @param searchDto
   */
  async searchMatches(searchDto: SearchMatchesDto): Promise<MatchModel[]> {
    const { query, fields } = searchDto;

    try {
      const queryBuilder = this.matchesRepository
        .createQueryBuilder('match')
        .leftJoinAndSelect('match.creator', 'creator')
        .leftJoinAndSelect('match.options', 'options');

      const conditions = [];
      const parameters: any = {};

      // If fields array is empty, search in all fields
      const fieldsToSearch =
        fields.length === 0 ? Object.values(SearchField) : fields;

      if (fieldsToSearch.includes(SearchField.TITLE)) {
        conditions.push('match.title LIKE :titleQuery');
        parameters.titleQuery = `%${query}%`;
      }

      if (fieldsToSearch.includes(SearchField.DESCRIPTION)) {
        conditions.push('match.description LIKE :descriptionQuery');
        parameters.descriptionQuery = `%${query}%`;
      }

      if (fieldsToSearch.includes(SearchField.CREATOR)) {
        conditions.push('creator.username LIKE :creatorQuery');
        parameters.creatorQuery = `%${query}%`;
      }

      if (fieldsToSearch.includes(SearchField.OPTIONS)) {
        conditions.push('options.name LIKE :optionsQuery');
        conditions.push('options.description LIKE :optionsQuery');
        parameters.optionsQuery = `%${query}%`;
      }

      if (conditions.length > 0) {
        queryBuilder.where(conditions.join(' OR '), parameters);
      } else {
        // This case should not occur now, but keep it as a safeguard
        return [];
      }

      return await queryBuilder.take(100).getMany();
    } catch (err) {
      console.error('Search error:', err);
      throw new InternalServerErrorException('Failed to search matches');
    }
  }

  /**
   * Returns the number of likes of a match
   * @param matchId
   */
  async getMatchLikeCounterById(matchId: string) {
    const match = await this.matchesRepository.findOne({
      where: { id: matchId },
      relations: ['likedUsers'],
    });

    if (!match) {
      throw new NotFoundException('No such match');
    }

    return match.likedUsers.length;
  }
}
