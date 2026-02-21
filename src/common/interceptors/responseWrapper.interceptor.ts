import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";


export default class ResponseWrapperInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        return next.handle().pipe(
            map((response: unknown) => {
                if (response && typeof response === 'object' && 'message' in response && 'data' in response)
                    return { success: true, message: response.message, data: response.data };

                return { success: true, message: 'Request successful', data: response };
            })
        );
    }
}