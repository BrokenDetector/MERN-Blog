import { customFetch } from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingScreen from "./Loading";
import { Button, buttonVariants } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type TPost = {
	_id: string;
	title: string;
	slug: string;
	content: string;
	comments?: { username: string; text: string }[];
	author: { username: string };
	is_public: boolean;
	createdAt: Date;
};

export default function DashPots() {
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState<TPost[]>([]);

	function formatDateTime(date: Date) {
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");
		return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
	}

	const handleShowMore = () => {
		customFetch(`/api/posts?page=${page}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.error) return console.log(data);
				setPosts((prev) => [...prev, ...data.posts]);
				setPage((prevPage) => prevPage + 1);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	const handleDelete = async (id: string) => {
		try {
			const res = await customFetch(`/api/delete-post/${id}`, {
				method: "post",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
			});
			if (res.ok) {
				setPosts(posts.filter((p) => p._id !== id));
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
				<TableCaption>A list of all posts.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Created at</TableHead>
						<TableHead>Title of post</TableHead>
						<TableHead>Update</TableHead>
						<TableHead>Delete</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{posts.map((post) => {
						return (
							<TableRow key={post._id}>
								<TableCell>{formatDateTime(new Date(post.createdAt))}</TableCell>
								<TableCell>
									<Link className={`${buttonVariants({ variant: "link" })} truncate`} to={`/post/${post.slug}`}>
										{post.title}
									</Link>
								</TableCell>
								<TableCell>
									<Button variant={"link"} size={"sm"} className="text-sm bg-green-600 hover:bg-green-500 w-fit">
										<Link to={`/post/update/${post._id}`} className="text-white">
											Update
										</Link>
									</Button>
								</TableCell>
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
												<DialogDescription> Are you sure you want to delete this post?</DialogDescription>
											</DialogHeader>
											<div className="flex flex-col justify-start ml-3">
												<h1>{post.slug}</h1>
												<h2 className="text-muted-foreground">By @{post.author.username}</h2>
											</div>
											<DialogFooter className="sm:justify-start">
												<DialogClose asChild>
													<Button className=" bg-red-600 hover:bg-red-500" onClick={() => handleDelete(post._id)}>
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
			{posts.length === 9 && (
				<Button variant={"outline"} onClick={handleShowMore} className="border-primary w-fit self-center mt-2">
					Show more
				</Button>
			)}
		</div>
	);
}
