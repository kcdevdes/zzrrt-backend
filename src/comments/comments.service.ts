import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchCommentsModel } from './entity/match-comments.entity';
import { Repository } from 'typeorm';
import { MatchesService } from '../matches/matches.service';
import { UserModel } from '../users/entity/users.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(MatchCommentsModel)
    private readonly matchCommentsRepository: Repository<MatchCommentsModel>,
    private readonly matchesService: MatchesService,
  ) {}

  /**
   * Get all comments of a match by matchId
   * @param matchId
   */
  async getAllCommentsOfMatchById(matchId: string) {
    return this.matchesService.findCommentsOfMatchById(matchId);
  }

  async addComment(user: UserModel, matchId: string, dto: CreateCommentDto) {
    const match = await this.matchesService.findMatchById(matchId);
    const newComment = this.matchCommentsRepository.create({
      comment: dto.comment,
      user,
      match,
    });

    return await this.matchCommentsRepository.save(newComment);
  }

  async patchComment(
    user: UserModel,
    commentId: string,
    dto: UpdateCommentDto,
  ) {
    const targetComment = await this.matchCommentsRepository.findOne({
      where: { id: commentId, user },
    });

    if (!targetComment) {
      throw new Error('Comment not found');
    }

    targetComment.comment = dto.comment;
    return await this.matchCommentsRepository.save(targetComment);
  }

  async deleteComment(user: UserModel, commentId: string) {
    const targetComment = await this.matchCommentsRepository.findOne({
      where: { id: commentId, user },
    });

    if (!targetComment) {
      throw new Error('Comment not found');
    }

    return await this.matchCommentsRepository.remove(targetComment);
  }
}
