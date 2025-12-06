import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { CurrentUserDto } from "../dtos";

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        // console.log(">>>> current user", data);
        const ctx = GqlExecutionContext.create(context);

        const user: CurrentUserDto = ctx.getContext().req.user;
        return user;
    },
);
