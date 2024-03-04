import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import Comment from "../models/Comment";
import Post from "../models/Post";
import User, { TUser } from "../models/User";

interface ICustomRequest extends Request {
    user?: any;
    query: { page: string };
}

export const verify_token = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const get_user = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id).select("-password").exec();

        if (!user) return res.status(400).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const get_users = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id).exec();
        if (!user?.is_admin) return res.status(401).json({ error: "Not an Admin" });

        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 9;

        const totalCount = await User.countDocuments();

        const all_users = await User.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .select("-password")
            .exec();

        if (all_users === null) return res.json({ error: "No users" });

        res.json({ all_users, totalCount });
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const create_user = [
    body("username", "Username must not be empty").trim().isLength({ min: 1 }).escape(),
    body("email", "Email must not be empty").trim().isLength({ min: 1 }).escape(),
    body("password", "Password must not be empty, minimum length is 5").trim().isLength({ min: 5 }).escape(),
    body("confirmPassword", "Password must match").custom((value, { req }) => {
        return value === req.body.password;
    }),

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const error = validationResult(req);

            const existingUserWithEmail = await User.findOne({ email: req.body.email }).exec();
            if (existingUserWithEmail) {
                return res.status(400).json({ error: "Email already in use!" });
            }
            if (!error.isEmpty()) {
                console.log(error.array());
                return res.status(400).json(error.array());
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hashedPAssword) => {
                    if (err) return next(err);
                    else {
                        const user: HydratedDocument<TUser> = new User({
                            username: req.body.username,
                            email: req.body.email,
                            password: hashedPAssword,
                        });
                        await user.save();
                        res.json({ message: "success" });
                    }
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500);
            next(err);
        }
    },
];

export const login = [
    body("email", "Bad request").trim().isEmail().escape(),

    async (req: Request, res: Response, next: NextFunction) => {
        const error = validationResult(req);
        try {
            if (!error.isEmpty()) {
                console.log(error.array());
                return res.status(400).json(error.array());
            } else {
                const user = await User.findOne({ email: req.body.email }).exec();
                if (user) {
                    const match = await bcrypt.compare(req.body.password, user.password);
                    if (!match) {
                        return res.status(401).json({ error: "Incorrect password" });
                    } else {
                        const token = jwt.sign(
                            { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin },
                            process.env.SECRET_KEY!,
                            {
                                expiresIn: "24h",
                            }
                        );

                        return res.json({
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                is_admin: user.is_admin,
                            },
                            token,
                        });
                    }
                } else {
                    res.status(404).json({ error: "User not found" });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500);
            next(err);
        }
    },
];

export const update_user = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id).exec();
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user?._id?.toString() !== req.user.id) return res.status(401).json({ error: "You are not allowed to edit this user" });
        const newUser = await User.findByIdAndUpdate(user.id, { username: req.body.username }).select("-password");
        res.json(newUser);
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const delete_user = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const userObj = await User.findById(req.params.id).exec();
        if (!userObj) return res.status(404).json({ error: "User not found" });

        const user = await User.findById(req.user.id).exec();
        if (user?._id?.toString() !== req.user.id && !user?.is_admin)
            return res.status(401).json({ error: "You are not allowed to delete this user" });

        await Comment.deleteMany({ author: userObj });
        await Post.deleteMany({ author: userObj });

        await User.findByIdAndDelete(userObj.id);
        res.json({ message: "success" });
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};
