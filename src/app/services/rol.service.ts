import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catalogueInterface, pagDto } from '@interfaces/commons.interface';
import { fixedQueryParams } from '@utilsFunctions/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private urlBase: string = `${environment.api}/rol`;
  constructor(private httpClient: HttpClient) {}
  getRoles(
    pageSize: number,
    pageNumber: number,
    all?: boolean,
    NameCont?: string
  ): Observable<pagDto<catalogueInterface>> {
    const params: any = fixedQueryParams({
      pageSize,
      pageNumber,
      all,
      NameCont,
    });
    return this.httpClient.get<pagDto<catalogueInterface>>(`${this.urlBase}`, {
      params,
    });
  }
}
