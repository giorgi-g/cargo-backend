## Installation
### Please use node:16.13 version upon installation
###

```bash
$ npm install
```

## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migration:
```bash
# Create a migration script
$ npm run typeorm migration:create ./src/migrations/MIGRATION_NAME

# Run generated migrations
$ npm run typeorm migration:run

# Revert migrated scripts
$ npm run typeorm migration:revert
```
