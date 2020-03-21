import { RequestHandler, Request, Response } from "express";

const Login: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK!" });
};

const Signup: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK!" });
};

const Logout: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK!" });
}

const Grant: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK!" });
}

const Revoke: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK!" });
}

const Permissions: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK!" });
}

const Role: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "OK!" });
}

export { Login, Signup, Logout, Revoke, Grant, Permissions, Role };