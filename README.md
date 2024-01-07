# Played Games Saver

Played Games Saver is a full-stack website designed to streamline your gaming experience. Create an account to rate your played games on a scale of 1 to 10, and easily save them to your personalized list. Keep track of your gaming journey by documenting your preferences and discovering new favorites with this intuitive platform. Never forget a memorable gaming experience again!

## Getting started

1. Clone the repository using Git: `git clone https://github.com/EHB-MCT/portfolio-starter-ilyasassakali.git`
2. Navigate to the project directory: `cd portfolio-starter-ilyasassakali`
3. Build and start the app using Docker Compose: `docker-compose up --build`.

#### Environment Variables

* `POSTGRES_USER` - Specifies the user account utilized by applications and services to connect to the PostgreSQL server.
* `POSTGRES_PASSWORD` - Sets the password for authenticating with the PostgreSQL database server.
* `POSTGRES_DB` - Determines the database with which applications and services will interact.
* `POSTGRES_HOST_AUTH_METHOD` - Specifies the authentication method for connecting to the PostgreSQL host.
* `PG_CONNECTION_STRING` - This environment variable represents the connection string for Knex.js.

## API Documentation

This endpoint allows you to retrieve a list of all users.
```shell
GET /users
```

This endpoint allows you to create a new user.
```shell
POST /users
```

This endpoint allows you to delete a user by their ID.
```shell
DELETE /users/:id
```

This endpoint allows you to update the details of a user by their ID.
```shell
PUT /users/:id
```

This endpoint allows a user to log in.
```shell
POST /users/login
```

This endpoint allows you to save a game for a specific user.
```shell
POST /games/:userId
```

This endpoint allows you to delete a game saved by a specific user.
```shell
DELETE /games/:userId/:gameId
```

This endpoint allows you to retrieve all games saved by a specific user.
```shell
GET /games/:userId
```

This endpoint allows you to update a saved game by a specific user.
```shell
PUT /games/:userId/:gameId
```

## Run tests

Use the command npm test to run tests after having docker-compose up --build

## License 

This project is licensed under the [MIT License](LICENSE).

## Resources

- Courses DEV5 Jan Everaert
- https://expressjs.com/
- https://jestjs.io/
- https://knexjs.org/guide/

## Contact

ilyas.assakali@student.ehb.be
