export const dayStart = (date?: Date): string =>
    `${(date != null ? new Date(date) : new Date())
        .toISOString()
        .substring(0, 10)} 00:00:00`;

export const dayEnd = (date?: Date): string =>
    `${(date != null ? new Date(date) : new Date())
        .toISOString()
        .substring(0, 10)} 23:59:59`;

export const dayByTimeZone = (
    date: number,
    timeZone: number,
    isEnd: boolean,
): number => {
    const utcDate = new Date(
        `${new Date(date).toISOString().substring(0, 10)} ${
            isEnd === true ? "23:59:59" : "00:00:00"
        }`,
    );

    const seconds = timeZone !== 0 ? 60 * 60 * 1000 : 0;

    return utcDate.getTime() + seconds;
};

export const splitBearer = (header: string) => {
    const [, body] = header.split(".");

    if (!body) return null;

    try {
        return JSON.parse(Buffer.from(body, "base64").toString());
    } catch (e: any) {
        return null;
    }
};

export const isValidToken = (user: any, roles: string[]) => {
    if (!user) {
        return false;
    }

    if (!roles.includes(user.roleId.toString())) {
        return false;
    }

    return user.sub.startsWith("USER-");
};

export const dayStartMillis = (): number => new Date(dayStart()).getTime();
export const dayEndMillis = (): number => new Date(dayEnd()).getTime();

export const hoursBefore = (hours: number): Date =>
    new Date(new Date().getTime() - 60 * 60 * hours * 1000);
