export const pagination = (params: any) => {
    const page = Number(params.page) || 1;
    const size = Number(params.size) || 10;

    const skip = (page - 1) * size;
    const take = size;

    return {
        skip,
        take,
    };
};
