import { Moment } from 'moment';
import { authorDto } from './author.interface';
import { commentsDto } from './comments.interface';
import { catalogueInterface } from './commons.interface';

export interface bookCreationDto {
  title: string;
  dateCreation: Date;
  authorIds: number[];
  categoriesId: number[];
  numPages: number;
  languageId: number;
}

export interface bookDto {
  id: number;
  title: string;
  description: string;
  dateCreation: Date;
  numPages: number;
  language: catalogueInterface;
  authors: authorDto[];
  categories: catalogueInterface[];
}

export interface bookQueryFilter {
  titleCont?: string;
  dateCreationGreat?: Moment;
  dateCreationSmall?: Moment;
  numPages?: number;
  languageId?: number;
}
