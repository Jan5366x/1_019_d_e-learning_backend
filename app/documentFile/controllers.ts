import { RequestHandler, Request, Response } from "express";
const formidable = require('formidable')
import { S3 } from "aws-sdk";
import { readFile, writeFileSync } from "fs";
import ExpressError from "../classes/ExpressError";

const s3 = new S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const CreateBucket: RequestHandler = (req: Request, res: Response, next: Function) => {
    console.log()
    const bucketName = req.body.bucketName.toLowerCase();
    if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));
    s3.createBucket({ Bucket: bucketName }, function (err, data) {
        if (err) 
            return next(new ExpressError(err.message, "Bucket could not be created.", 400));
        res.status(201).json({ message: "Successfully created bucket: " + bucketName });
    });
};

const PostFile: RequestHandler = (req: Request, res: Response, next: Function) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err: any, fields: any, files: any) => {
        if (err) 
            return next(new ExpressError("FILEUPLOAD_ERROR", "File could not be uploaded.", 400));

            const { bucketName } = fields;
            const { file } = files;
            if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));
            readFile(file.path, function (err, data) {
                if (err) {
                    return next(new ExpressError("FILEUPLOAD_ERROR", "File could not be uploaded.", 400));
                } else {
                    const params = {
                        ACL: 'private',
                        Body: data,
                        Bucket: `${bucketName}`,
                        Key: `${file.name}`
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
        Bucket: `${bucketName}`,
        Key: `${awsKey}`
    };
    console.log(bucketName);
    s3.getObject(params, (err : any, data: any) => {
        if (err) return next(new ExpressError("FILE_NOT_READABLE", "File could not be read.", 400));
        console.log(data);
        writeFileSync(data.filename, data.Body.toString());
        console.log(`${filePath} has been created!`);
      });
    return;
};


const DeleteFile: RequestHandler = (req: Request, res: Response, next: Function) => {
    const bucketName = req.params.bucketName.toLowerCase();
    const key = req.params.awsKey;
    if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));
    if (key == null) return next(new ExpressError("AWSKEY_REQUIRED", "You have to provide a file specific key.", 400));

    const params = {
        Bucket: `${bucketName}`,
        Key: `${key}`
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