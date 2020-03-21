import { RequestHandler, Request, Response } from "express";
import { UserM, RoleM } from "./model";
import ExpressError from "../classes/ExpressError";
import * as checkString from "../tools/checkLength";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import config from "../config"

const emailRegex: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const Login: RequestHandler = (req: Request, res: Response, next: Function) => {
    res.status(200).json({ message: "OK!" });
};

const Signup: RequestHandler = async (req: Request, res: Response, next: Function) => {
    if (req.body.email == null) return next(new ExpressError("EMAIL_REQUIRED", "You have to provide an email address.", 400));
    if (req.body.username == null) return next(new ExpressError("USERNAME_REQUIRED", "You have to provide a username.", 400));
    if (req.body.password == null) return next(new ExpressError("PASSWORD_REQUIRED", "You have to provide a password.", 400));

    if (!emailRegex.test(req.body.email)) return next(new ExpressError("EMAIL_FORMAT_ERROR", "You have provided an inavlid email address.", 400));
    if (checkString.max(req.body.email, 255)) return next(new ExpressError("EMAIL_TOO_LONG", "You have to provide an email address with a maximum length of 255 chars.", 400));

    if (checkString.min(req.body.username, 6)) return next(new ExpressError("USERNAME_TOO_SHORT", "You have to provide a username with a length of at least 6 chars.", 400));
    if (checkString.max(req.body.username, 50)) return next(new ExpressError("USERNAME_TOO_LONG", "You have to provide a username with a maximum length of 50 chars.", 400));

    if (checkString.min(req.body.password, 6)) return next(new ExpressError("PASSWORD_TOO_SHORT", "You have to provide a password with a length of at least 6 chars.", 400));
    if (checkString.max(req.body.password, 255)) return next(new ExpressError("PASSWORD_TOO_LONG", "You have to provide a password with a maximum length of 255 chars.", 400));
    if ((typeof req.body.password === 'string' || req.body.password instanceof String) &&
        req.body.password.split("").every((char: string) => char == req.body.password[0]))
        return next(new ExpressError("PASSWORD_NOT_ENOUGH_ENTROPY", "You have to provide an password with enough entropy.", 400));

    if (checkString.min(req.body.name, 3)) return next(new ExpressError("NAME_TOO_SHORT", "You have to provide a name with a length of at least 3 chars.", 400));
    if (checkString.max(req.body.name, 50)) return next(new ExpressError("NAME_TOO_LONG", "You have to provide a name with a maximum length of 50 chars.", 400));

    if (checkString.min(req.body.firstname, 3)) return next(new ExpressError("FIRSTNAME_TOO_SHORT", "You have to provide a firstname with a length of at least 3 chars.", 400));
    if (checkString.max(req.body.firstname, 50)) return next(new ExpressError("FIRSTNAME_TOO_LONG", "You have to provide a firstname with a maximum length of 50 chars.", 400));

    try {
        let existing = await UserM.find({ email: req.body.email }).exec();
        if (existing.length == null || existing.length == 0) return next(new ExpressError("EMAIL_ALREADY_REGISTERED", "You have provided an email that already exists", 400));

        existing = await UserM.find({ username: req.body.username }).exec();
        if (existing.length == null || existing.length == 0) return next(new ExpressError("USERNAME_ALREADY_REGISTERED", "You have provided an username that already exists", 400));
    }
    catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_CHECKING_DUPICATES", e.message, 500));
    }
    let hashed: string;

    try {
        hashed = await bcrypt.hash(req.body.password, 10);
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_HASHING", e.message, 500));
    }

    console.log(hashed);

    const createdUser = new UserM({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email,
        password: hashed
    })


    try {
        await createdUser.save()
    } catch (e) { return next(new ExpressError("INTERNAL_ERROR_SAVING_USER", e.message, 500)); }

    res.status(201).json({
        message: "USER_CREATED", user: {
            email: req.body.email,
            _id: createdUser._id,
            username: req.body.username,
        },
        token: jsonwebtoken.sign({
            email: req.body.email,
            _id: createdUser._id,
            username: req.body.username,
            permissions: []

        }, config.jsonwebtoken, { expiresIn: 3700 }),
        furtherRequests: {
            type: "POST",
            description: "USER_LOGIN",
            url: "http://" + req.headers.host + "/user/login",
            body: { email: "String", username: "String", password: "String" },
            authenticationNeeded: false,
            permissionsNeeded: []
        }
    })
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