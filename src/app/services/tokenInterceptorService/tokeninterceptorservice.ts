import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()

export class TokenInterceptorService implements HttpInterceptor {
   intercept(request: HttpRequest<any>, next: HttpHandler):   Observable<HttpEvent<any>> {
        const access_token = localStorage.getItem('access_token');
        //console.log("Access token: ", access_token)

        if (access_token) {
            request = request.clone({
                setHeaders: {
                Authorization: `Token ${access_token}`
                }
            });
        }

        return next.handle(request);
   }
}
