// lib/app.ts
import express from 'express';
import UserManageRouter from "./user/routes"
import bodyParser from "body-parser";
import morgan from "morgan";
import ExpressError from "./classes/ExpressError";
import mongoose from "mongoose";

// Create a new express application instance
const app: express.Application = express();

const morganExcludedUrls: Array<String> = [];

app.use(morgan("dev", { skip: (req, res) => morganExcludedUrls.includes(req.originalUrl) }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/test')

app.use("/user", UserManageRouter);

app.use((req, res, next) => {
    const error: ExpressError = new ExpressError("Not found");
    error.status = 404;
    next(error);
});

app.use((error: ExpressError, req: express.Request, res: express.Response, next: any) => {
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