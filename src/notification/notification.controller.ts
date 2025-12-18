import {
    Controller,
    Get,
    Post,
    Param,
    Delete,
    Query,
    Patch,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { CurrentUser } from "../users/decorators/user.decorator";
import { CurrentUserDto } from "../users/dtos";
import { NotificationInput } from "@generated";

@Controller("notifications")
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    findAll(
        @Query() request: NotificationInput,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.notificationService.findAll(user, request);
    }

    @Get("/unread-count")
    findUnreadCount(@CurrentUser() user: CurrentUserDto) {
        return this.notificationService.findUnreadCount(user);
    }

    @Get("/:id")
    findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.notificationService.findOne(id, user);
    }

    @Patch("/:id/read")
    markAsRead(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.notificationService.markAsRead(id, user);
    }

    @Patch("/read-all")
    markAllAsRead(@CurrentUser() user: CurrentUserDto) {
        return this.notificationService.markAllAsRead(user);
    }

    @Delete("/:id")
    remove(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
        return this.notificationService.remove(id, user);
    }

    @Delete()
    removeAll(@CurrentUser() user: CurrentUserDto) {
        return this.notificationService.removeAll(user);
    }
}
