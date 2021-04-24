# Permanence etudiante API

this project is done with node/adonis

[staging](https://permanence-spf-staging-api.herokuapp.com/)

[staging documentation](https://permanence-spf-staging-api.herokuapp.com/docs/)
you can tests any api via the "Try it out" button in the documentation page

## Requirements

- npm >= 7.3.0
- node >= 15.5.1
- docker
- docker-compose

## setup

start database (mysql)

```bash
docker-compose up
```

install backend

```bash
npm install
```

set env

```bash
cp .env.example .env
```

run database migrations

```bash
node ace migration:run
```

## Start

start backend server

```bash
npm start
```

## Tests

run test suite

```bash
npm run test
```

## Documentation

check the url

```bash
http://127.0.0.1:3333/docs/
```
