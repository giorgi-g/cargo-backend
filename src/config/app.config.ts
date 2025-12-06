export default () => ({
    apiConfig: null,
    database: {
        host: process.env.DATABASE_HOST,
        name: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
    },
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_BUCKET_REGION: process.env.S3_BUCKET_REGION,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    S3_BUCKET_USER_NAME: process.env.S3_BUCKET_USER_NAME,
});
