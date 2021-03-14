const { test, trait, beforeEach } = use("Test/Suite")("Post");
const Post = use("App/Models/Post");
const Token = use("App/Models/Token");
const User = use("App/Models/User");
const Factory = use("Factory");
const Database = use("Database");

trait("Test/ApiClient");
trait("Auth/Client");
trait("DatabaseTransactions");

let user;
let volunteer;

beforeEach(async () => {
  user = await Factory.model("App/Models/User").create();
  volunteer = await Factory.model("App/Models/User").create({
    isVolunteer: true,
  });
});

test("when not auth client get 401 when trying to get list of posts", async ({
  client,
}) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  await Factory.model("App/Models/Post").create();
  const response = await client.get("/posts").end();

  response.assertStatus(401);
});

test("get list of posts", async ({ client, assert }) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  const response = await client.get("/posts").loginVia(user).end();

  response.assertStatus(200);
  assert.equal(response.body[0].content, post.content);
  assert.equal(response.body[0].title, post.title);
  assert.equal(response.body[0].isForVolunteers, post.isForVolunteers);
  assert.equal(response.body[0].userId, volunteer.id);
});

test("when not auth client get 401 when trying to get detail of a post", async ({
  client,
}) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  const response = await client.get(`/posts/${post.id}`).end();

  response.assertStatus(401);
});

test("get detail of a post", async ({ client, assert }) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  const response = await client.get(`/posts/${post.id}`).loginVia(user).end();

  response.assertStatus(200);
  assert.equal(response.body.content, post.content);
  assert.equal(response.body.title, post.title);
  assert.equal(response.body.isForVolunteers, post.isForVolunteers);
  assert.equal(response.body.userId, volunteer.id);
});

test("when not auth client get 401 when trying to create a post", async ({
  client,
}) => {
  const post = await Factory.model("App/Models/Post").make();
  const response = await client.post("/posts").send({ post }).end();

  response.assertStatus(401);
});

test("when auth as student you should get 401 when trying to create a post", async ({
  client,
}) => {
  const post = await Factory.model("App/Models/Post").make();
  const response = await client
    .post("/posts")
    .send({ post })
    .loginVia(user)
    .end();

  response.assertStatus(401);
});

test("create a post as volunteer", async ({ client, assert }) => {
  const post = await Factory.model("App/Models/Post").make();
  const response = await client
    .post("/posts")
    .send({ post })
    .loginVia(volunteer)
    .end();

  response.assertStatus(201);
  assert.equal(response.body.content, post.content);
  assert.equal(response.body.title, post.title);
  assert.equal(response.body.isForVolunteers, post.isForVolunteers);
  assert.equal(response.body.user_id, volunteer.id);
});

test("when not auth client get 401 when trying to update a post", async ({
  client,
}) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  const response = await client
    .put(`/posts/${post.id}`)
    .send({ post: { title: "whatever" } })
    .end();

  response.assertStatus(401);
});

test("when not auth as student you should get 401 when trying to update a post", async ({
  client,
}) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  const response = await client
    .put(`/posts/${post.id}`)
    .send({ post: { title: "whatever" } })
    .loginVia(user)
    .end();

  response.assertStatus(401);
});

test("update an basic-service as volunteer", async ({ client, assert }) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  const response = await client
    .put(`/posts/${post.id}`)
    .send({ post: { title: "whatever" } })
    .loginVia(volunteer)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.content, post.content);
  assert.equal(response.body.title, "whatever");
  assert.equal(response.body.isForVolunteers, post.isForVolunteers);
});

test("when not auth client get 401 when trying to delete a post", async ({
  client,
}) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  const response = await client.delete(`/posts/${post.id}`).end();

  response.assertStatus(401);
});

test("when auth as student you should get 401 when trying to delete a post", async ({
  client,
}) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  const response = await client
    .delete(`/posts/${post.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(401);
});

test("delete a post as volunteer", async ({ client, assert }) => {
  const post = await Factory.model("App/Models/Post").make();
  await volunteer.posts().save(post);
  const response = await client
    .delete(`/posts/${post.id}`)
    .loginVia(volunteer)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.content, post.content);
  assert.equal(response.body.title, post.title);
  assert.equal(response.body.isForVolunteers, post.isForVolunteers);
  const deletedPost = await Post.find(post.id);

  assert.equal(deletedPost, null);
});
