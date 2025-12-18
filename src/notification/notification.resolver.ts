import { Injectable, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import {
    NotificationEntity,
    NotificationResponse,
    NotificationInput,
} from "@generated";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../authorization/auth/guards/gql-auth.guard";

@Injectable()
@Resolver(() => NotificationEntity)
export class NotificationResolver {
    constructor(private readonly notificationService: NotificationService) {}

    @Query(() => NotificationResponse)
    @UseGuards(GqlAuthGuard)
    findNotifications(
        @Args("request") request: NotificationInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.notificationService.findAll(user, request);
    }

    @Query(() => Int)
    @UseGuards(GqlAuthGuard)
    findUnreadNotificationCount(@CurrentUser() user: CurrentUserDto) {
        return this.notificationService.findUnreadCount(user);
    }

    @Query(() => NotificationEntity, { nullable: true })
    @UseGuards(GqlAuthGuard)
    findNotificationById(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.notificationService.findOne(id, user);
    }

    @Mutation(() => NotificationEntity)
    @UseGuards(GqlAuthGuard)
    markNotificationAsRead(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.notificationService.markAsRead(id, user);
    }

    @Mutation(() => Int)
    @UseGuards(GqlAuthGuard)
    markAllNotificationsAsRead(@CurrentUser() user: CurrentUserDto) {
        return this.notificationService.markAllAsRead(user).then((r) => r.count);
    }

    @Mutation(() => NotificationEntity)
    @UseGuards(GqlAuthGuard)
    deleteNotification(
        @Args("id") id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.notificationService.remove(id, user);
    }

    @Mutation(() => Int)
    @UseGuards(GqlAuthGuard)
    deleteAllNotifications(@CurrentUser() user: CurrentUserDto) {
        return this.notificationService.removeAll(user).then((r) => r.count);
    }
}
