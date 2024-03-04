import mongoose from "mongoose";

const Schema = mongoose.Schema;

export type TUser = {
    _id?: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    is_admin?: boolean;
};

const UserSchema = new Schema<TUser>(
    {
        username: {
            type: String,
            required: [true, "Username is required, minimum length is 3."],
            minlength: 3,
            maxlength: 50,
            unique: true,
        },
        email: { type: String, required: [true, "Email is required."], minlength: 1, maxlength: 100, unique: true },
        password: { type: String, required: [true, "Password is required, minimum length is 5"], minlength: 5, maxlength: 100 },
        is_admin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<TUser>("User", UserSchema);
