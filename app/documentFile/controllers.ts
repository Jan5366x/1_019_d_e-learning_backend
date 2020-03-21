import { RequestHandler, Request, Response } from "express";

const PostFile: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK!" });
};

export { PostFile };