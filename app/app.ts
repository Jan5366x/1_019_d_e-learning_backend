// lib/app.ts
import ExpressError from "./classes/ExpressError";

import express from 'express';

//Express modules
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";

// Configs
import config from "../config";
import pjson from "../package.json";

//Routers
import UserManageRouter from "./user/routes"
import CourseRouter from "./course/routes"
import LessonRouter from "./lesson/routes"
import AvatarTemplatesRouter from './avatarTemplate/routes';
import QuizRouter from './quizs/routes';
import StudentClassRouter from "./studentClass/routes";
import StepRouter from "./step/routes";


import cors from "cors";
// Create a new express application instance
const app: express.Application = express();

//Startup Script
import StartUp from "./init"


const corsOptions = {
  origin: ['*'],
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
  credentials: true,
  enablePreflight: true
}

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Logging

const morganExcludedUrls: Array<String> = [];
app.use(morgan("dev", { skip: (req, res) => morganExcludedUrls.includes(req.originalUrl) }))

// PARSE GET / POST BODIES

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set Headers (CORS)

app.set("x-powered-by", false);

/*app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Max-Age", "86400")
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});*/

// MONGODB

const mongoUserAuth: boolean = (config.mongodb.username != null && config.mongodb.password != null);

mongoose.connect(`mongodb://${!mongoUserAuth ? "" : config.mongodb.username}\
${!mongoUserAuth ? "" : ":"}\
${!mongoUserAuth ? "" : config.mongodb.password}\
${!mongoUserAuth ? "" : "@"}${config.mongodb.domain || "localhost"}:\
${config.mongodb.port || 27017}/${config.mongodb.database}`, { useNewUrlParser: true, useUnifiedTopology: true });

StartUp.checkDB()

// ROUTES

app.use("/user", UserManageRouter);
app.use("/quiz", QuizRouter);
app.use("/course", CourseRouter);
app.use("/lesson", LessonRouter);
app.use("/student-class", StudentClassRouter);
app.use("/avatartemplates", AvatarTemplatesRouter)
app.use("/step", StepRouter);
// STATIC

app.get("/version", (req, res) => { res.status(200).json({ message: "OK", version: pjson.version }) });

// 404

app.use((req, res, next) => {
  next(new ExpressError("PAGE_NOT_FOUND", "Sorry, we could't find the page you've requested!", 404));
});

// Error handling

app.use((error: ExpressError, req: express.Request, res: express.Response, next: Function) => {
  if (error.needAuth)
    res.header("WWW-Authenticate",
      'Basic realm="Log in/Get token for the application", charset="UTF-8"')
  res.status(error.status || 500);
  res.json({
    message: error.message,
    err: error.humanReadableError,
    error: true
  });

  if (error.message.includes("INTERNAL_ERROR")) console.error(error);
});

// Start Server

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
