import { customFetch } from "@/utils/customFetch";
import { useEffect, useState } from "react";
import LoadingScreen from "./Loading";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type TUser = {
	_id: string;
	username: string;
	email: string;
	createdAt: Date;
	is_admin: boolean;
};

export default function DashUsers() {
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<TUser[]>([]);

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
		customFetch(`/api/users?page=${page}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) return console.log(data);
				setUsers((prev) => [...prev, ...data.all_users]);
				setPage((prevPage) => prevPage + 1);
			})
			.catch((error) => console.error(error))
			.finally(() => {
				setLoading(false);
			});
	};

	const handleDelete = async (id: string) => {
		try {
			const res = await customFetch(`/api/delete-user/${id}`, {
				method: "post",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` },
			});

			if (res.ok) {
				setUsers(users.filter((u) => u._id !== id));
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
				<TableCaption>A list of all users.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Created at</TableHead>
						<TableHead>Username</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Is Admin</TableHead>
						<TableHead>Delete</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => {
						return (
							<TableRow key={user._id}>
								<TableCell>{formatDateTime(new Date(user.createdAt))}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.is_admin.toString()}</TableCell>
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
												<DialogDescription>
													Are you sure you want to delete this user? This will also delete all posts and comments
													from that user.
												</DialogDescription>
											</DialogHeader>
											<div className="flex flex-col justify-start ml-3">
												<h1>{user.username}</h1>
												<h2 className="text-muted-foreground">{user.email}</h2>
											</div>
											<DialogFooter className="sm:justify-start">
												<DialogClose asChild>
													<Button className=" bg-red-600 hover:bg-red-500" onClick={() => handleDelete(user._id)}>
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
			{users.length === 9 && (
				<Button variant={"outline"} onClick={handleShowMore} className="border-primary w-fit self-center mt-2">
					Show more
				</Button>
			)}
		</div>
	);
}
