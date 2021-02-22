"use strict";

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const Factory = use("Factory");

Factory.blueprint("App/Models/User", async (faker) => {
  return {
    username: faker.name(),
    email: faker.email(),
    password: "password",
  };
});

Factory.blueprint("App/Models/BasicService", async (faker) => {
  return {
    startAt: faker.date(),
    endAt: faker.date(),
    maxPeople: faker.integer({ min: 1, max: 50 }),
    isClosed: faker.bool(),
  };
});
