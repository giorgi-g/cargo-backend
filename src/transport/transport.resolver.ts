import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TransportService } from "./transport.service";
import { TransportEntity, TransportInput } from "@generated";
import { CreateTransportInput, UpdateTransportInput } from "./types";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";

@Resolver(() => TransportEntity)
export class TransportResolver {
    constructor(private readonly transportService: TransportService) {}

    @Mutation(() => TransportEntity)
    createTransport(
        @Args("userId", { type: () => String }) userId: string,
        @Args("input") input: CreateTransportInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.transportService.create(userId, input, user);
    }

    @Query(() => [TransportEntity])
    findTransports(@Args("input") input: TransportInput) {
        return this.transportService.findAll(input);
    }

    @Query(() => TransportEntity)
    findTransport(@Args("id", { type: () => String }) id: string) {
        return this.transportService.findOne(id);
    }

    @Mutation(() => TransportEntity)
    updateTransport(
        @Args("id", { type: () => String }) id: string,
        @Args("input") input: UpdateTransportInput,
    ) {
        console.log(">>> input", input);
        return this.transportService.update(id, input);
    }

    @Mutation(() => TransportEntity)
    removeTransport(@Args("id", { type: () => String }) id: string) {
        return this.transportService.remove(id);
    }
}
