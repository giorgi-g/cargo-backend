import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token = req?.query?.token;

        if (token) {
            req.headers.authorization = `Bearer ${token}`;
        }

        next();
    }
}
