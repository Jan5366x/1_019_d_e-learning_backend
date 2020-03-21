import { RequestHandler, Request, Response } from "express";
import { S3 } from "aws-sdk";
import ExpressError from "../classes/ExpressError";

const s3 = new S3({
    accessKeyId: '',
    secretAccessKey: ''
});

const CreateBucket: RequestHandler = (req: Request, res: Response, next: Function) => {
    console.log()
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

const PostFile: RequestHandler = (req: Request, res: Response, next: Function) => {
    const bucketName = req.body.bucketName.toLowerCase();
    if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));
    const params = {
        ACL: 'private',
        Body: buffer,
        Bucket: `${bucketName}`,
        Key: `${name}`
      };
    s3.upload(params, function (err, data) {
        if (err) {
            return next(new ExpressError(err.message, "File could not be uploaded", 400));
        } else {
            res.status(201).json({ message: "Successfully uploaded file."});
        }
    });
};

const GetFile: RequestHandler = (req: Request, res: Response, next: Function) => {
    const bucketName = req.params.bucketName.toLowerCase();
    const key = req.params.awsKey;
    if (bucketName == null) return next(new ExpressError("BUCKETNAME_REQUIRED", "You have to provide a bucket name.", 400));
    if (key == null) return next(new ExpressError("AWSKEY_REQUIRED", "You have to provide a file specific key.", 400));

    const params = {
        Bucket: `${bucketName}`,
        Key: `${key}`
      };
      const stream = s3.getObject(params).createReadStream();
      // forward errors
      stream.on('error', next(new ExpressError("FILE_COULD_NOT_BE_READ", "File could not be read.", 400)));

      stream.on('end', () => {
        // console.log(`read file ${file}`);
      });
      // Pipe the s3 object to the response
      stream.pipe(res);
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
      const stream = s3.deleteObject(params, function (err, data) {
          if (err){
            return next(new ExpressError(err.message, "File could not be deleted", 400));
          }else{
            res.status(200).json({ message: "Successfully deleted file."});
          }
      });
};

export { PostFile, CreateBucket, GetFile, DeleteFile };