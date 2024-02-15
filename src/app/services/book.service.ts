import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {
  bookCreationDto,
  bookDto,
  bookQueryFilter,
} from '@interfaces/book.interface';
import { pagDto } from '@interfaces/commons.interface';
import { fixedQueryParams } from '@utilsFunctions/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private urlBase: string = `${environment.api}/books`;
  constructor(private httpClient: HttpClient) {}
  getAll(
    pageNumber: number,
    pageSize: number,
    queryParams: bookQueryFilter
  ): Observable<pagDto<bookDto>> {
    const params = fixedQueryParams({ pageNumber, pageSize, ...queryParams });
    return this.httpClient.get<pagDto<bookDto>>(`${this.urlBase}`, { params });
  }

  get(id: number, all?: boolean): Observable<bookDto> {
    const params: any = fixedQueryParams({ all });
    return this.httpClient.get<bookDto>(`${this.urlBase}/${id}`, {
      params,
    });
  }
  post(data: bookCreationDto) {
    return this.httpClient.post(`${this.urlBase}`, data);
  }
  put(id: number, data: bookCreationDto) {
    return this.httpClient.put(`${this.urlBase}/${id}`, data);
  }
  delete(id: number) {
    return this.httpClient.delete(`${this.urlBase}/${id}`);
  }
}
