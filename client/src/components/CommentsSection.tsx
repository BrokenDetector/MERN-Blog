import Comment from "@/components/Comment";
import { Button } from "@/components/ui/button";
import { AuthContext, TAuthContext } from "@/context/AuthContext";
import { customFetch } from "@/utils/customFetch";
import "highlight.js/styles/github-dark-dimmed.css";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

type TCommentsProps = {
	postId: string;
};

type TComment = {
	author: { username: string; _id: string };
	text: string;
	_id: string;
	createdAt: Date;
};

export default function CommentsSection({ postId }: TCommentsProps) {
	const { user } = useContext(AuthContext) as TAuthContext;
	const [loading, setLoading] = useState(false);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState<TComment[] | []>([]);

	useEffect(() => {
		const getComments = async () => {
			try {
				const res = await customFetch(`/api/get-comments/${postId}`);
				if (res.ok) {
					const data = await res.json();
					setComments(data);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getComments();
	}, [postId]);

	const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await customFetch("/api/create-comment", {
				method: "post",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
				body: JSON.stringify({ text: comment, postId }),
			});

			if (res.ok) {
				const data = await res.json();
				setComment("");
				setComments([data, ...comments]);
			} else {
				throw new Error("Failed to create comment");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = async (comment: TComment, editedContent: string) => {
		setComments(comments.map((c) => (c._id === comment._id ? { ...c, text: editedContent } : c)));
	};

	const handleDelete = async (id: string) => {
		customFetch(`/api/delete-comment/${id}`, {
			method: "post",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
		})
			.then((res) => {
				if (res.ok) {
					setComments(comments.filter((comment) => comment._id !== id));
				}
			})
			.catch((error) => console.log(error));
	};

	return (
		<section className="">
			{user ? (
				<form className="border border-input rounded-lg p-5 max-w-2xl container mx-auto" onSubmit={handleSubmitComment}>
					<textarea
						placeholder="Add a comment..."
						rows={3}
						className="resize-none rounded-lg p-2 w-full bg-muted"
						maxLength={200}
						onChange={(e) => setComment(e.target.value)}
						value={comment}
					/>
					<div className="flex justify-between items-center mt-5">
						<p className="text-muted-foreground text-xs">{200 - comment.length} characters remaining</p>
						<Button variant={"default"} type="submit" disabled={loading}>
							Submit
						</Button>
					</div>
				</form>
			) : (
				<div className="container mx-auto flex justify-center items-center mt-5">
					You need to be
					<Link to={"/sign-in"} className="hover:underline test-primary  mx-1">
						<h1 className="text-primary"> logged in </h1>
					</Link>
					to leave a comments
				</div>
			)}
			<section className="max-w-2xl container mx-auto p-5 flex flex-col gap-2">
				{comments && comments?.length > 0 ? (
					<>
						{comments?.map((comment) => {
							return <Comment comment={comment} onEdit={handleEdit} onDelete={handleDelete} key={comment._id} />;
						})}
					</>
				) : (
					<></>
				)}
			</section>
		</section>
	);
}
