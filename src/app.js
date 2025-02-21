"use strict";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import instanceMongodb from "./dbs/init.mongodb.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
