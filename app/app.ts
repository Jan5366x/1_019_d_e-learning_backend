// lib/app.ts
import express from 'express';
import UserManageRouter from "./user/routes"
import bodyParser from "body-parser";
import morgan from "morgan";
import ExpressError from "./classes/ExpressError";
import mongoose from "mongoose";
import config from "./config";


// Create a new express application instance
const app: express.Application = express();

// Logging

const morganExcludedUrls: Array<String> = [];
app.use(morgan("dev", { skip: (req, res) => morganExcludedUrls.includes(req.originalUrl) }))

// PARSE GET / POST BODIES

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MONGODB

const mongoUserAuth: boolean = (config.mongodb.username != null && config.mongodb.password != null);

mongoose.connect(`mongodb://${!mongoUserAuth ? "" : config.mongodb.username}\
${!mongoUserAuth ? "" : ":"}\
${!mongoUserAuth ? "" : config.mongodb.password}\
${!mongoUserAuth ? "" : "@"}${config.mongodb.domain || "localhost"}:\
${config.mongodb.port || 27017}/${config.mongodb.database}`, { useNewUrlParser: true, useUnifiedTopology: true });

// ROUTES

app.use("/user", UserManageRouter);

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