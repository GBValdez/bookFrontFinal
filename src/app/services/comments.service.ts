import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {
  commentsDto,
  commentsDtoCreation,
} from '@interfaces/comments.interface';
import { pagDto } from '@interfaces/commons.interface';
import { fixedQueryParams } from '@utilsFunctions/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private url = `${environment.api}/books`;

  constructor(private httpClient: HttpClient) {}
  post(comment: commentsDtoCreation, bookId: number): Observable<commentsDto> {
    return this.httpClient.post<commentsDto>(
      `${this.url}/${bookId}/comments`,
      comment
    );
  }
  getAll(
    pageNumber: number,
    pageSize: number,
    bookId: number
  ): Observable<pagDto<commentsDto>> {
    const params = fixedQueryParams({ pageNumber, pageSize });
    return this.httpClient.get<pagDto<commentsDto>>(
      `${this.url}/${bookId}/comments`,
      { params }
    );
  }
  delete(id: number, bookId: number) {
    return this.httpClient.delete(`${this.url}/${bookId}/comments/${id}`);
  }
  update(comment: commentsDtoCreation, commentId: number) {
    return this.httpClient.put(`${this.url}/0/comments/${commentId}`, comment);
  }
}
