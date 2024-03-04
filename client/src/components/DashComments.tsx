import { customFetch } from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingScreen from "./Loading";
import { Button, buttonVariants } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type TComments = {
	_id: string;
	text: string;
	author: { username: string };
	postId: { slug: string };
	createdAt: Date;
};

export default function DashComments() {
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [comments, setComments] = useState<TComments[]>([]);

	function formatDateTime(date: Date) {
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");
		return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
	}

	const handleShowMore = () => {
		customFetch(`/api/comments?page=${page}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) return console.log(data);
				setComments((prev) => [...prev, ...data.comments]);
				setPage((prevPage) => prevPage + 1);
			})
			.catch((error) => console.error(error))
			.finally(() => {
				setLoading(false);
			});
	};

	const handleDelete = async (id: string) => {
		try {
			const res = await customFetch(`/api/delete-comment/${id}`, {
				method: "post",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
			});

			if (res.ok) {
				setComments(comments.filter((c) => c._id !== id));
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		handleShowMore();
	}, []);

	return (
		<div className="flex flex-col container">
			<Table>
				<TableCaption>A list of all comments.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Created at</TableHead>
						<TableHead>Text</TableHead>
						<TableHead>Post</TableHead>
						<TableHead>Author</TableHead>
						<TableHead>Delete</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{comments.map((comment) => {
						return (
							<TableRow key={comment._id}>
								<TableCell>{formatDateTime(new Date(comment.createdAt))}</TableCell>
								<TableCell>{comment.text}</TableCell>
								<TableCell>
									<Link
										className={`${buttonVariants({
											variant: "link",
										})}`}
										to={`/post/${comment.postId.slug}`}
									>
										{comment.postId.slug}
									</Link>
								</TableCell>
								<TableCell>{comment.author.username}</TableCell>
								<TableCell>
									<Dialog>
										<DialogTrigger asChild>
											<Button size={"sm"} className="text-sm bg-red-600 hover:bg-red-500 w-fit">
												Delete
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-md">
											<DialogHeader>
												<DialogTitle>Delete user</DialogTitle>
												<DialogDescription> Are you sure you want to delete this comment?</DialogDescription>
											</DialogHeader>
											<div className="flex flex-col justify-start ml-3">
												<h1>{comment.text}</h1>
												<h2 className="text-muted-foreground">By @{comment.author.username}</h2>
											</div>
											<DialogFooter className="sm:justify-start">
												<DialogClose asChild>
													<Button
														className=" bg-red-600 hover:bg-red-500"
														onClick={() => handleDelete(comment._id)}
													>
														Yes, I'm sure
													</Button>
												</DialogClose>
												<DialogClose asChild>
													<Button variant={"outline"}>No, cancel</Button>
												</DialogClose>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			{loading && <LoadingScreen />}
			{comments.length === 9 && (
				<Button variant={"outline"} onClick={handleShowMore} className="border-primary w-fit self-center mt-2">
					Show more
				</Button>
			)}
		</div>
	);
}
