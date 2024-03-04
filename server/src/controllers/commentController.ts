import { NextFunction, Request, Response } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";
import User from "../models/User";

interface ICustomRequest extends Request {
    user?: any;
    query: { page: string };
}

export const get_comments = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id).exec();

        if (!user?.is_admin) return res.status(401).json({ error: "Not an Admin" });

        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 9;

        const totalCount = await Comment.countDocuments();

        const comments = await Comment.find()
            .populate({ path: "postId", select: "slug" })
            .populate({ path: "author", select: "-password" })
            .sort({ createdAt: -1 })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec();

        if (comments === null) return res.json({ error: "No comments" });

        res.json({ comments, totalCount });
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const get_post_comments = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const comments = await Comment.find({ postId: req.params.id })
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "-password" });

        if (comments === null) return res.json({ error: "No comments" });
        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const create_comment = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id).exec();
        const { text, postId } = req.body;
        const post = await Post.findById(postId).exec();

        const newComment = new Comment({
            text,
            author: user,
            postId: post,
        });
        const updateComments = (prev: object[]) => {
            if (prev.length === 0) return [newComment];
            return [...prev, newComment];
        };
        await Post.findByIdAndUpdate(postId, {
            id: post?.id,
            comments: updateComments(post?.comments!),
        });
        await newComment.save();
        res.json(newComment);
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const update_comment = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const comment = await Comment.findById(req.params.id).exec();
        if (comment === null) {
            return res.status(404).json({ error: "Comment not found" });
        }
        if (comment?.author._id?.toString() !== req.user.id && !req.user.is_admin) {
            res.status(403).json({ error: "You are not allowed to delete this comment" });
        }
        await Comment.findByIdAndUpdate(comment.id, { text: req.body.text });
        res.json({ message: "success" });
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};

export const delete_comment = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const comment = await Comment.findById(req.params.id).exec();

        if (comment === null) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment?.author._id?.toString() !== req.user.id && !req.user.is_admin) {
            res.status(403).json({ error: "You are not allowed to delete this comment" });
        }

        await Comment.findByIdAndDelete(comment.id);
        res.json({ message: "success" });
    } catch (err) {
        console.log(err);
        res.status(500);
        next(err);
    }
};
