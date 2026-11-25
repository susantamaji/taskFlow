import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

let mongo;
beforeAll(async () => {
  process.env.JWT_SECRET = "test_secret_for_taskflow";
  process.env.NODE_ENV = "test";
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  await connectDB();
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});
test("register hashes password and login returns token", async () => {
  const payload = {
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
  };
  const registered = await request(app)
    .post("/api/auth/register")
    .send(payload);
  expect(registered.status).toBe(201);
  const login = await request(app)
    .post("/api/auth/login")
    .send({ identifier: "testuser", password: "password123" });
  expect(login.status).toBe(200);
  expect(login.body.token).toBeTruthy();
  expect(login.body.user.passwordHash).toBeUndefined();
});
test("duplicate username/email is rejected", async () => {
  const payload = {
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
  };
  const response = await request(app).post("/api/auth/register").send(payload);
  expect(response.status).toBe(409);
});
