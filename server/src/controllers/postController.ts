import { NextFunction, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";

interface ICustomRequest extends Request {
    user?: any;
    query: { page: string; searchTerm: string };
}

export const get_posts = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 9;
        const searchTerm = req.query.searchTerm || "";
        const regex = new RegExp(searchTerm, "i");
        const totalCount = await Post.countDocuments();
        const posts = await Post.find({ title: { $regex: regex } })
            .populate({ path: "author", select: "username" })
            .sort({ createdAt: -1 })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec();

        if (!posts) return res.json({ error: "No posts" });

        res.json({ posts, totalCount });
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const get_post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
            .populate({ path: "author", select: "username" })
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "-password",
                },
            })
            .exec();
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const create_post = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id).exec();
        if (!user?.is_admin) return res.status(401).json({ error: "Not an Admin" });

        const { title, content } = req.body;
        const author = req.user.id;
        const slug = req.body.title
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, "");
        const newPost = new Post({
            title,
            slug,
            content,
            author,
        });

        await newPost.save();
        res.json({ message: "success" });
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const update_post = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id).exec();
        if (!user?.is_admin) return res.status(401).json({ error: "Not an Admin" });

        const { title, content } = req.body;

        const post = await Post.findById(req.params.id).exec();
        if (!post) return res.status(404).json({ error: "Post not found" });
        const author = req.user.id;
        const slug = req.body.title
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, "");
        const newPost = new Post({
            _id: post?._id,
            title: title ? title : post?.title,
            slug,
            content: content ? content : post?.content,
            author,
        });

        await newPost.save();
        res.json({ message: "success" });
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const delete_post = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id).exec();
        if (!user?.is_admin) return res.status(401).json({ error: "Not an Admin" });

        const post = await Post.findById(req.params.id).exec();
        if (!post) return res.status(404).json({ error: "Post not found" });
        await Post.findByIdAndDelete(post.id);
        res.json({ message: "success" });
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};
