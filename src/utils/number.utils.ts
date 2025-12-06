export function convertBigIntegers<T>(obj: any): T {
    if (Array.isArray(obj)) {
        return obj.map(convertBigIntegers) as T;
    } else if (obj && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key,
                typeof value === "bigint"
                    ? value.toString()
                    : convertBigIntegers(value),
            ]),
        ) as T;
    }

    return obj;
}
