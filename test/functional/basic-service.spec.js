const { test, trait, beforeEach } = use("Test/Suite")("BasicService");
const BasicService = use("App/Models/BasicService");
const Token = use("App/Models/Token");
const User = use("App/Models/User");
const Factory = use("Factory");
const Database = use("Database");

trait("Test/ApiClient");
trait("Auth/Client");
trait("DatabaseTransactions");

let user;

beforeEach(async () => {
  user = await Factory.model("App/Models/User").create();
});

test("when not auth client get 401 when trying to get list of basic service", async ({
  client,
}) => {
  Factory.model("App/Models/BasicService").create();
  await Factory.model("App/Models/BasicService").create();
  const response = await client.get("/basic-services").end();

  response.assertStatus(401);
});

test("get list of basic service", async ({ client, assert }) => {
  basicService = await Factory.model("App/Models/BasicService").create();
  const response = await client.get("/basic-services").loginVia(user).end();

  response.assertStatus(200);
  assert.equal(response.body[0].isClosed, basicService.isClosed);
  assert.equal(response.body[0].maxPeople, basicService.maxPeople);
  assert.equal(Date(response.body[0].startAt), Date(basicService.startAt));
  assert.equal(Date(response.body[0].endAt), Date(basicService.endAt));
});

test("when not auth client get 401 when trying to get detail of an basic service", async ({
  client,
}) => {
  await Factory.model("App/Models/BasicService").create();
  const response = await client.get(`/basic-services/${basicService.id}`).end();

  response.assertStatus(401);
});

test("get detail of a basic service", async ({ client, assert }) => {
  basicService = await Factory.model("App/Models/BasicService").create();
  const response = await client
    .get(`/basic-services/${basicService.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.isClosed, basicService.isClosed);
  assert.equal(response.body.maxPeople, basicService.maxPeople);
  assert.equal(Date(response.body.startAt), Date(basicService.startAt));
  assert.equal(Date(response.body.endAt), Date(basicService.endAt));
});

test("when not auth client get 401 when trying to create an basic-service", async ({
  client,
}) => {
  const basicService = await Factory.model("App/Models/BasicService").make();
  const response = await client
    .post("/basic-services")
    .send({ basicService })
    .end();

  response.assertStatus(401);
});

test("create an basic service", async ({ client, assert }) => {
  const basicService = await Factory.model("App/Models/BasicService").make();
  const response = await client
    .post("/basic-services")
    .send({ basicService })
    .loginVia(user)
    .end();

  response.assertStatus(201);
  assert.equal(response.body.isClosed, basicService.isClosed);
  assert.equal(response.body.maxPeople, basicService.maxPeople);
  assert.equal(Date(response.body.startAt), Date(basicService.startAt));
  assert.equal(Date(response.body.endAt), Date(basicService.endAt));
});

test("when not auth client get 401 when trying to update an basic-service", async ({
  client,
}) => {
  const basicService = await Factory.model("App/Models/BasicService").create();
  const response = await client
    .put(`/basic-services/${basicService.id}`)
    .send({ basicService: { maxPeople: 100 } })
    .end();

  response.assertStatus(401);
});

test("update an basic-service", async ({ client, assert }) => {
  const basicService = await Factory.model("App/Models/BasicService").create();
  const response = await client
    .put(`/basic-services/${basicService.id}`)
    .send({ basicService: { maxPeople: 100 } })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.isClosed, basicService.isClosed);
  assert.equal(response.body.maxPeople, 100);
  assert.equal(Date(response.body.startAt), Date(basicService.startAt));
  assert.equal(Date(response.body.endAt), Date(basicService.endAt));
});

test("when not auth client get 401 when trying to delete an basic-service", async ({
  client,
}) => {
  const basicService = await Factory.model("App/Models/BasicService").create();
  const response = await client
    .delete(`/basic-services/${basicService.id}`)
    .end();

  response.assertStatus(401);
});

test("delete an basic-service", async ({ client, assert }) => {
  const basicService = await Factory.model("App/Models/BasicService").create();
  const response = await client
    .delete(`/basic-services/${basicService.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.isClosed, basicService.isClosed);
  assert.equal(response.body.maxPeople, basicService.maxPeople);
  assert.equal(Date(response.body.startAt), Date(basicService.startAt));
  assert.equal(Date(response.body.endAt), Date(basicService.endAt));
  const deleteBasicService = await BasicService.find(basicService.id);

  assert.equal(deleteBasicService, null);
});
