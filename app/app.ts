// lib/app.ts
import express from 'express';
import UserManageRouter from "./user/routes"
import DocumentFileRouter from "./documentFile/routes"
import bodyParser from "body-parser";
import morgan from "morgan";
import ExpressError from "./classes/ExpressError";
import mongoose from "mongoose";
import config from "./config";


// Create a new express application instance
const app: express.Application = express();

const morganExcludedUrls: Array<String> = [];

app.use(morgan("dev", { skip: (req, res) => morganExcludedUrls.includes(req.originalUrl) }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoUserAuth: boolean = (config.mongodb.username != null && config.mongodb.password != null);

mongoose.connect(`mongodb://${!mongoUserAuth ? "" : config.mongodb.username}\
${!mongoUserAuth ? "" : ":"}\
${!mongoUserAuth ? "" : config.mongodb.password}\
${!mongoUserAuth ? "" : "@"}${config.mongodb.domain || "localhost"}:\
${config.mongodb.port || 27017}/${config.mongodb.database}`, { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/user", UserManageRouter);

app.use("/documentFile", DocumentFileRouter);

app.use((req, res, next) => {
    const error: ExpressError = new ExpressError("Not found");
    error.status = 404;
    next(error);
});

app.use((error: ExpressError, req: express.Request, res: express.Response, next: Function) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});