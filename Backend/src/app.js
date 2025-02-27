"use strict";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import instanceMongodb from "./dbs/init.mongodb.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "No-Retry"],
    credentials: true,
  })
);

//dbs
instanceMongodb;

//routes
app.use("/", router);

class HttpError extends Error {
  constructor(message) {
    super(message);
    this.status = null;
  }
}

app.use((req, res) => {
  const error = new HttpError("Not found");
  error.status = 404;
  throw error;
});

app.use(async (err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    code: statusCode,
  });
});

export default app;
