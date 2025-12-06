import { Injectable, UseGuards } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import {
    MembershipPlanEntity,
    CreateMembershipPlanDto,
    RoleEnum,
    UpdateMembershipPlanDto,
} from "@generated";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";
import { Roles } from "../authorization/roles/decorators";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";

@Injectable()
@Resolver(() => MembershipPlanEntity)
export class MembershipResolver {
    constructor(private readonly membershipService: MembershipService) {}

    @Mutation(() => MembershipPlanEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    createMembershipPlan(
        @Args("request") request: CreateMembershipPlanDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.membershipService.create(request, user.id);
    }

    @Query(() => [MembershipPlanEntity])
    @UseGuards(GqlAuthGuard)
    findMembershipPlans() {
        return this.membershipService.findAll();
    }

    @Query(() => MembershipPlanEntity)
    @UseGuards(GqlAuthGuard)
    findMembershipPlanById(@Args("id") id: string) {
        return this.membershipService.findOne(id);
    }

    @Mutation(() => MembershipPlanEntity)
    @UseGuards(GqlAuthGuard)
    @Roles(RoleEnum.ROOT)
    updateMembershipPlan(
        @Args("id") id: string,
        @Args("request") request: UpdateMembershipPlanDto,
    ) {
        return this.membershipService.update(id, request);
    }
}
