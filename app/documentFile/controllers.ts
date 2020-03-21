import { RequestHandler, Request, Response } from "express";
import { S3, Endpoint } from "aws-sdk";
import ExpressError from "../classes/ExpressError";

const PostFile: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK!" });
};

const CreateBucket: RequestHandler = (req: Request, res: Response, next: Function) => {
    const s3 = new S3({
        accessKeyId: '',
        secretAccessKey: ''
    });
    const bucketName = req.body.bucketName.toLowerCase();
    if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));
    s3.createBucket({ Bucket: bucketName }, function (err, data) {
        if (err) {
            return next(new ExpressError(err.message, "Bucket could not be created.", 400));
        } else {
            res.status(201).json({ message: "Successfully created bucket: " + bucketName });
        }
    });
};


export { PostFile, CreateBucket };