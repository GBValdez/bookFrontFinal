import { UserDto } from './user.interface';

export interface commentsDto {
  id: number;
  content: string;
  user: UserDto;
}

export interface commentsDtoCreation {
  content: string;
}
