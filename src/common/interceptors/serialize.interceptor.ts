import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    UseInterceptors,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { instanceToPlain } from "class-transformer";

export function Serialize() {
    return UseInterceptors(new SerializerInterceptor());
}

export class SerializerInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        handler: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return handler.handle().pipe(
            map((data: any) => {
                return instanceToPlain(data);
            }),
        );
    }
}
