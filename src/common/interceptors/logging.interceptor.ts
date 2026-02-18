import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from 'rxjs/operators';
import { Observable } from "rxjs";
import type { Request } from "express";


@Injectable()
export default class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        const requestMethod = request.method;
        const requestUrl = request.url;

        const requestStartingTime = Date.now();

        return next
            .handle()
            .pipe(tap(() => console.log(`${requestMethod}::${requestUrl}::${Date.now() - requestStartingTime}ms`)));
    }
}