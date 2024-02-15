import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private spinnerSvc: NgxSpinnerService,
    private authService: AuthService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let params = new HttpParams();
    req.params.keys().forEach((key) => {
      const value = req.params.get(key);
      if (value != null && value != undefined && value != '') {
        params = params.set(key, value);
      }
    });
    const cloneRequest = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${this.authService.getAuth()?.token}`
      ),
      params,
    });
    this.spinnerSvc.show();
    return next.handle(cloneRequest).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        if (error.error.message !== undefined)
          Swal.fire('Error', error.error.message, 'error');
        if (error.error.errors !== undefined) {
          let messages: string = '';
          const ERROR_OBJECT = error.error.errors;
          for (const property in ERROR_OBJECT) {
            let messageLocal: string = '';
            ERROR_OBJECT[property].forEach((element: string) => {
              messageLocal += element + '\n';
            });
            messages += messageLocal + '\n';
          }
          Swal.fire('Error', messages, 'error');
        }

        return throwError(error);
      }),
      finalize(() => {
        this.spinnerSvc.hide();
      })
    );
  }
}
