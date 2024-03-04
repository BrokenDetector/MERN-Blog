import mongoose from "mongoose";
import { TComment } from "./Comment";
import { TUser } from "./User";

const Schema = mongoose.Schema;

export type TPost = {
    _id?: mongoose.Types.ObjectId;
    title: string;
    slug?: string;
    content: string;
    comments: TComment[] | [];
    author: TUser;
};

const PostSchema = new Schema<TPost>(
    {
        title: { type: String, required: [true, "Title is required"], minlength: 1, maxlength: 100, unique: true },
        slug: { type: String, unique: true },
        content: { type: String, required: [true, "content is required"], minlength: 1, maxlength: 10000 },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        author: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Author is required"] },
    },
    { timestamps: true }
);

export default mongoose.model<TPost>("Post", PostSchema);
