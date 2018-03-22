// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs/Observable';
import {CONFIG} from '../../../index.config';

/* tslint:disable */
// We can disable tslint for this file as any is required here.
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly cookies_: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authCookie = this.cookies_.get(CONFIG.authTokenCookieName);
    // Filter requests made to our backend starting with 'api/v1' and append request header
    // with token stored in a cookie.
    if (req.url.startsWith('api/v1') && authCookie.length) {
      const authReq = req.clone({headers: req.headers.set(CONFIG.authTokenHeaderName, authCookie)});

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
/* tslint:enable */
