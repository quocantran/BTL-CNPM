"use strict";

import mongoose from "mongoose";

class Database {
  static instance;
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    const url = process.env.MONGODB_URI || "mongodb://localhost:27017/BTL";

    mongoose
      .connect(url, {
        maxPoolSize: 50,
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((error) => {
        console.error("Database connection error: ", error);
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;
