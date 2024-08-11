import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchModel } from './entity/matches.entity';
import { Repository } from 'typeorm';
import { UserModel } from '../users/entity/users.entity';
import { CreateMatchDto } from './dto/create-match.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(MatchModel)
    private readonly matchesRepository: Repository<MatchModel>,
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async createMatch(
    creator: UserModel,
    dto: CreateMatchDto,
  ): Promise<MatchModel> {
    try {
      const newMatch = this.matchesRepository.create({
        creator,
        title: dto.title,
        description: dto.description,
      });
      return await this.matchesRepository.save(newMatch);
    } catch (err) {
      throw new InternalServerErrorException('Failed to create a new match');
    }
  }

  async findAllMatches() {
    try {
      return await this.matchesRepository.find({
        relations: {
          creator: true,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException('Failed to find all matches');
    }
  }

  async findMatchById(id: string): Promise<MatchModel> {
    const existingMatch = await this.matchesRepository.findOne({
      where: { id },
      relations: {
        creator: true,
      },
    });
    if (!existingMatch) {
      throw new NotFoundException('No such match');
    }

    return existingMatch;
  }

  async postMatchHistory(user: UserModel, id: string) {
    const existingMatch = await this.findMatchById(id);
    if (!existingMatch) {
      throw new NotFoundException('No such match');
    }
  }
}
