import { RequestHandler, Request, Response } from "express";
const formidable = require('formidable')
import { S3 , AWSError} from "aws-sdk";
import { readFile } from "fs";
import ExpressError from "../classes/ExpressError";
import config from "../../config"
import { S3FileM, S3BucketM } from "./model"
import mongoose from "mongoose"

const s3 = new S3({
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
});

const uniqueIdentifierForBucket = config.s3.uniqueBucketIdentifier;


const CreateBucket: RequestHandler = async(req: Request, res: Response, next: Function) => {
    console.log()
    const bucketName = `${uniqueIdentifierForBucket}-${req.body.bucketName.toLowerCase()}`
    if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));

    const createdS3Bucket = new S3BucketM({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.bucketName.toLowerCase(),
        uniqueId: uniqueIdentifierForBucket
    })

    try {
        await createdS3Bucket.save()
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_BUCKET_SAVE_FAILED", "Bucket could not be saved in mongodb.", 500))
    }

    try { 
        await s3.createBucket({ Bucket: bucketName }).promise()
    }
    catch (e) {
        try {
            await S3BucketM.deleteOne({ _id: createdS3Bucket._id }).exec()
        }
        catch (e) {
            return next(new ExpressError("INTERNAL_ERROR_DELETE_MONGO_BUCKET", "Failed to delete mongodb Bucket.", 500))    
        }
        return next(new ExpressError("INTERNAL_ERROR_BUCKET_SAVE_FAILED", "Bucket could not be saved.", 400))
    }

    res.status(201).json({ message: "Successfully created bucket: " + bucketName });
};

const PostFile: RequestHandler = (req: Request, res: Response, next: Function) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err: any, fields: any, files: any) => {
        if (err) 
            return next(new ExpressError("FILEUPLOAD_ERROR", "File could not be uploaded.", 400));

            const { bucketName } = fields;
            const { file } = files;
            if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));
            readFile(file.path, function (err, data : Buffer) {
                if (err) {
                    return next(new ExpressError("FILEUPLOAD_ERROR", "File could not be uploaded.", 400));
                } else {
                    const params = {
                        ACL: 'private',
                        Body: data,
                        Bucket: `${uniqueIdentifierForBucket}-${bucketName}`,
                        Key: `${file.name}`,
                        ContentType: file.type
                    };
                    s3.upload(params, function (err : any, data : any) {
                        if (err) {
                            return next(new ExpressError(err.message, "File could not be uploaded", 400));
                        } else {
                            res.status(201).json({ message: "Successfully uploaded file." });
                        }
                    });
                }
            });

        
    });


};

const GetFile: RequestHandler = (req: Request, res: Response, next: Function) => {
    const { bucketName, awsKey } = req.query;
    if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));
    if (awsKey == null) return next(new ExpressError("AWSKEY_REQUIRED", "You have to provide a file specific key.", 400));
    const params = {
        Bucket: `${uniqueIdentifierForBucket}-${bucketName}`,
        Key: `${awsKey}`
    };
    s3.getObject(params, (err: AWSError, data: S3.GetObjectOutput) => {
        if (err || data.Body == null) return next(new ExpressError("FILE_NOT_READABLE", err.message, 400));
        res.status(200).json({message: "FILE_READ", filename: awsKey, contents: data.Body!!.toString("base64"), mimeType: data.ContentType})
      });
    return;
};


const DeleteFile: RequestHandler = (req: Request, res: Response, next: Function) => {
    const { bucketName, awsKey } = req.query;
    if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));
    if (awsKey == null) return next(new ExpressError("AWSKEY_REQUIRED", "You have to provide a file specific key.", 400));
    const params = {
        Bucket: `${uniqueIdentifierForBucket}-${bucketName}`,
        Key: `${awsKey}`
    };
    const stream = s3.deleteObject(params, function (err : any, data : any) {
        if (err) {
            return next(new ExpressError(err.message, "File could not be deleted", 400));
        } else {
            res.status(200).json({ message: "Successfully deleted file." });
        }
    });
};

export { PostFile, CreateBucket, GetFile, DeleteFile };