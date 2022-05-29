import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/user/user.js";
mongoose
  .connect("mongodb://localhost/node", { useNewUrlParser: true })
  .then(() => {
    console.log("conneted...");
  })
  .catch(() => {
    console.log("not connected");
  });
const server = express();

server.use(express.json());
server.use("/", userRouter);

server.listen(3000, () => {
  console.log("listening on port 300");
});
