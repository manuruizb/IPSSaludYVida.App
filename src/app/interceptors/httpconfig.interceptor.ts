import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import Dialogtype, { Dialog } from '../libs/dialog.lib';
import { LoaderService } from '../services/loader.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class HttpConfigInterceptor implements HttpInterceptor {

    loader = false;

    mivariable: boolean = (1 === 1) ? true : false;

    constructor(
        private loaderService: LoaderService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.loader = false;

        if (!request.url.includes('noload')) {
            this.loaderService.show();
            this.loader = true;
        }

        if (request.headers.get("skip"))
            return next.handle(request);

        if (!request.url.includes('nocontent')) {
            if (!request.headers.has('Content-Type'))
                request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        if (!request.headers.has('Accept'))
            request = request.clone({ headers: request.headers.set('Accept', 'application/json') });


        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {

                    this.loaderService.hide();
                    this.loader = false
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data: any = {};
                data = {
                    reason: error && error.error && error.error.reason ? error.error.reason : '',
                    status: error.status,
                    message: error && error.error && error.error.data ? error.error.data.error : error.message,
                    exceptionMessage: error && error.error ? error.error.exceptionMessage : error.message,
                    exceptionType: error && error.error ? error.error.exceptionType : null
                };

                if (data["status"] != "" && data["status"] == "500") {

                    this.loaderService.hide();

                    Dialog.show('Ha ocurrido un error con el servicio', Dialogtype.error);
                    return throwError('error-->>>' + error);

                }
                else if (data["status"] != "" && data["status"] == "401") {
                    this.loaderService.hide();
                    this.router.navigate(['/']);
                    return throwError('error-->>>' + error);
                }
                else if (data["status"] != "" && data["status"] == "403") {
                    this.loaderService.hide();
                    this.router.navigate(['/']);
                    return throwError('error-->>>' + error);
                }
                else {
                    this.loaderService.hide();
                    if (data.message) {
                        Dialog.show(data.message, Dialogtype.warning);
                    }

                    return throwError('error-->>>' + error);
                }

            }),
            finalize(() => { })
        );

    }
}

