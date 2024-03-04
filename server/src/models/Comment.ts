import mongoose from "mongoose";
import { TPost } from "./Post";
import { TUser } from "./User";

const Schema = mongoose.Schema;

export type TComment = {
    _id?: mongoose.Types.ObjectId;
    text: string;
    author: TUser;
    postId: TPost;
};

const CommentSchema = new Schema<TComment>(
    {
        text: { type: String, required: [true, "Text is required"], maxlength: 200 },
        author: { type: Schema.Types.ObjectId, ref: "User", required: [true, "User is required"] },
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: [true, "Post is required"] },
    },
    { timestamps: true }
);

export default mongoose.model<TComment>("Comment", CommentSchema);
