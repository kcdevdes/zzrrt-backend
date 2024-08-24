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
import { CommentsService } from './comments.service';
import { AccessTokenGuard } from '../auth/guards/bearer-token.guard';
import { User } from '../users/decorator/user.decorator';
import { UserModel } from '../users/entity/users.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('Comments API')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('match/:matchId')
  async getAllCommentsOfMatch(@Param('matchId') id: string) {
    return this.commentsService.getAllCommentsOfMatchById(id);
  }

  @Post('match/:matchId')
  @UseGuards(AccessTokenGuard)
  async addComment(
    @User() user: UserModel,
    @Param('matchId') id: string,
    @Body() comment: CreateCommentDto,
  ) {
    return this.commentsService.addComment(user, id, comment);
  }

  @Patch('match/:commentId')
  @UseGuards(AccessTokenGuard)
  async patchComment(
    @User() user: UserModel,
    @Param(':commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.patchComment(user, commentId, dto);
  }

  @Delete('match/:commentId')
  @UseGuards(AccessTokenGuard)
  async deleteComment(
    @User() user: UserModel,
    @Param(':commentId') commentId: string,
  ) {
    return this.commentsService.deleteComment(user, commentId);
  }
}
