import { AuthContext, TAuthContext } from "@/context/AuthContext";
import { customFetch } from "@/utils/customFetch";
import moment from "moment";
import { useContext, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type TCommentProps = {
	comment: TComment;
	onEdit: (comment: TComment, editedContent: string) => Promise<void>;
	onDelete: (id: string) => void;
};

type TComment = {
	author: { username: string; _id: string };
	text: string;
	_id: string;
	createdAt: Date;
};

export default function Comment({ comment, onEdit, onDelete }: TCommentProps) {
	const { user } = useContext(AuthContext) as TAuthContext;
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState("");

	const handleEdit = () => {
		setIsEditing(true);
		setEditedContent(comment.text);
	};

	const handleSave = () => {
		customFetch(`/api/update-comment/${comment._id}`, {
			method: "post",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
			body: JSON.stringify({ text: editedContent }),
		})
			.then((res) => {
				if (res.ok) {
					setIsEditing(false);
					onEdit(comment, editedContent);
				}
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className="border-2 border-input p-2 rounded-lg">
			<div className="flex flex-row items-center gap-1">
				<h1 className="text-sm">@{comment.author.username}</h1>
				<p className="italic text-xs text-muted-foreground">{moment(comment.createdAt).fromNow()}</p>
			</div>
			{isEditing ? (
				<>
					<textarea
						placeholder="Add a comment..."
						rows={2}
						className="resize-none rounded-lg p-2 w-full bg-muted"
						maxLength={200}
						onChange={(e) => setEditedContent(e.target.value)}
						value={editedContent}
					/>
					<p className="text-muted-foreground text-xs mt-2">{200 - editedContent.length} characters remaining</p>
					<div className="flex justify-end gap-2 text-xs">
						<Button className="bg-green-500" size={"sm"} onClick={handleSave}>
							Save
						</Button>
						<Button variant={"outline"} size={"sm"} onClick={() => setIsEditing(false)}>
							Cancel
						</Button>
					</div>
				</>
			) : (
				<>
					<p className="text-lg ml-2">{comment.text}</p>
					{user && (user.id === comment.author._id || user.is_admin) && (
						<div>
							<Button variant={"ghost"} className="text-xs text-muted-foreground" size={"sm"} onClick={handleEdit}>
								Edit
							</Button>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="ghost" size={"sm"} className="text-xs text-muted-foreground">
										Delete
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>Delete comment</DialogTitle>
										<DialogDescription> Are you sure you want to delete this comment?</DialogDescription>
									</DialogHeader>
									<div className="flex items-center space-x-2">
										<h1>{comment.text}</h1>
									</div>
									<DialogFooter className="sm:justify-start">
										<DialogClose asChild>
											<Button className=" bg-red-600 hover:bg-red-500" onClick={() => onDelete(comment._id)}>
												Yes, I'm sure
											</Button>
										</DialogClose>
										<DialogClose asChild>
											<Button variant={"outline"}>No, cancel</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</>
			)}
		</div>
	);
}
