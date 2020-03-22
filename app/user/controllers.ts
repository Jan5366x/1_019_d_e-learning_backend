import { RequestHandler, Request, Response } from "express";
import { UserM, RoleM } from "./model";
import ExpressError from "../classes/ExpressError";
import * as checkString from "../tools/checkLength";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import config from "../../config"
import avatarTemplates from "../avatarTemplate/templates/all";


const emailRegex: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const Login: RequestHandler = async (req: Request, res: Response, next: Function) => {
    if (req.body.password == null) return next(new ExpressError("PASSWORD_REQUIRED", "You have to provide a password.", 400));
    if (req.body.username == null && req.body.email == null) return next(new ExpressError("USERNAME_OR_EMAIL_REQUIRED", "You have to provide either a username or an email address.", 400));
    if (req.body.role == null) return next(new ExpressError("ROLE_REQUIRED", "You have to provide a role.", 400));
    
    if (!emailRegex.test(req.body.email)) return next(new ExpressError("EMAIL_FORMAT_ERROR", "You have provided an inavlid email address.", 400));
    if (checkString.max(req.body.email, 255)) return next(new ExpressError("EMAIL_TOO_LONG", "You have to provide an email address with a maximum length of 255 chars.", 400));

    if (checkString.min(req.body.username, 6)) return next(new ExpressError("USERNAME_TOO_SHORT", "You have to provide a username with a length of at least 6 chars.", 400));
    if (checkString.max(req.body.username, 50)) return next(new ExpressError("USERNAME_TOO_LONG", "You have to provide a username with a maximum length of 50 chars.", 400));

    if (checkString.min(req.body.password, 6)) return next(new ExpressError("PASSWORD_TOO_SHORT", "You have to provide a password with a length of at least 6 chars.", 400));
    if (checkString.max(req.body.password, 255)) return next(new ExpressError("PASSWORD_TOO_LONG", "You have to provide a password with a maximum length of 255 chars.", 400));
    if ((typeof req.body.password === 'string' || req.body.password instanceof String) &&
        req.body.password.split("").every((char: string) => char == req.body.password[0]))
        return next(new ExpressError("PASSWORD_NOT_ENOUGH_ENTROPY", "You have to provide an password with enough entropy.", 400));

    let user: mongoose.Document | null;

    try {
        if (req.body.username != null) {
            user = await UserM.findOne({ username: req.body.username }).populate("Role").exec()
        }
        else {
            user = await UserM.findOne({ email: req.body.email }).populate("Role").exec()
        }
    }
    catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_GETTING_USER", e.message, 500));
    }

    if (user == null) return next(new ExpressError("USER_NOT_KNOWN", "Couldn't find user. Maybe want to signup?", 400));

    let valid: boolean;

    try {
        valid = await bcrypt.compare(req.body.password, user!!.get("password"));
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_VALIDATING_PASSWORD", e.message, 500));
    }

    if (!valid) return next(new ExpressError("INVALID_PASSWORD", "You have to provide the correct Password for your account.", 400, true));

    return res.status(200).json({
        message: "LOGGED_IN",
        token: jsonwebtoken.sign({
            email: user!!.get("email"),
            _id: user._id,
            permissions: user!!.get("permissions"),
            role: user!!.get("role"),
            firstname: user!!.get("firstname") == "" ? null : user!!.get("firstname"),
            name: user!!.get("name") == "" ? null : user!!.get("name"),
        }, config.jsonwebtoken, { expiresIn: 3700 }),
        user: {
            email: user!!.get("email"),
            _id: user._id,
            permissions: user!!.get("permissions"),
            role: user!!.get("role"),
            firstname: user!!.get("firstname") == "" ? null : user!!.get("firstname"),
            name: user!!.get("name") == "" ? null : user!!.get("name"),
            avatar: user!!.get("avatar") != null ? user!!.get("avatar") : avatarTemplates.getTemplate("BlankTemplate")
        },
        requests: []
    })
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
        if (existing.length != null && existing.length != 0) return next(new ExpressError("EMAIL_ALREADY_REGISTERED", "You have provided an email that already exists", 400));

        existing = await UserM.find({ username: req.body.username }).exec();
        if (existing.length != null && existing.length != 0) return next(new ExpressError("USERNAME_ALREADY_REGISTERED", "You have provided an username that already exists", 400));
    }
    catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_CHECKING_DUPICATES", e.message, 500));
    }

    let avatar = req.body.avatar;

    if (avatar == null && req.body.avatartemplate != null && !Object.keys(avatarTemplates.templates).includes(req.body.avatartemplate)) return next(new ExpressError("AVATARTEMPLATE_NOT_KNOWN", "The avatartemplate you have coosed is not known", 400))
    if (avatar != null && req.body.avatartemplate != null) avatar = avatarTemplates.getTemplate(req.body.avatartemplate);

    if (avatar != null && (avatar! instanceof Object || avatar["data"] == null)) return next(new ExpressError("INVALID_AVATAR_PROVIDED", "You have provided an inavlid Avatar.", 400));
    if (avatar == null && req.body.avatartemplate == null) avatar = avatarTemplates.getTemplate("BlankTemplate");

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
        role: req.body.role,
        firstname: req.body.firstname,
        email: req.body.email,
        password: hashed,
        avatar: avatar
    })


    try {
        await createdUser.save()
    } catch (e) { return next(new ExpressError("INTERNAL_ERROR_SAVING_USER", e.message, 500)); }

    res.status(201).json({
        message: "USER_CREATED", user: {
            email: req.body.email,
            _id: createdUser._id,
            username: req.body.username,
            permissions: [],
            role: req.body.role,
            firstname: req.body.firstname == "" ? null : req.body.firstname,
            name: req.body.name == "" ? null : req.body.name,
            avatar: avatar
        },
        token: jsonwebtoken.sign({
            email: req.body.email,
            _id: createdUser._id,
            username: req.body.username,
            permissions: [],
            role: req.body.role,
            firstname: req.body.firstname == "" ? null : req.body.firstname,
            name: req.body.name == "" ? null : req.body.name

        }, config.jsonwebtoken, { expiresIn: 3700 }),
        furtherRequests: [{
            type: "POST",
            description: "USER_LOGIN",
            url: "http://" + req.headers.host + "/user/login",
            body: { email: "String", username: "String", password: "String" },
            authenticationNeeded: false,
            permissionsNeeded: []
        }]
    })
};

const Logout: RequestHandler = (req: Request, res: Response) => {
    res.status(200).json({ message: "LOGOUT_AUTOMATICALLY", note: "Tokens are valid for one hour. After that, you are automatically logged out. Just remove the token from the Client." });
}

const Grant: RequestHandler = (req: Request, res: Response) => {
    res.status(501).json({ message: "NOT_IMPLEMENTED" });
}

const Revoke: RequestHandler = (req: Request, res: Response) => {
    res.status(501).json({ message: "NOT_IMPLEMENTED" });

}

const Permissions: RequestHandler = (req: Request, res: Response) => {
    res.status(501).json({ message: "NOT_IMPLEMENTED" });

}

const Role: RequestHandler = (req: Request, res: Response) => {
    res.status(501).json({ message: "NOT_IMPLEMENTED" });

}

const Roles: RequestHandler = (req: Request, res: Response, next: Function) => {
    
    RoleM.find({}).exec(function(err, roles){
        if(err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ_ROLES"), err.message)
        res.status(200).json({ message: "OK", docs: roles });
    });
}

export { Login, Signup, Logout, Revoke, Grant, Permissions, Role, Roles };
